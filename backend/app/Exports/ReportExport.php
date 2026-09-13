<?php

namespace App\Exports;

use App\Models\Transaction;
use App\Models\Motor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, ShouldAutoSize
{
    protected $reportData;
    protected $reportType;
    protected $startDate;
    protected $endDate;

    public function __construct($reportType, $startDate, $endDate)
    {
        $this->reportType = $reportType;
        $this->startDate = Carbon::parse($startDate);
        $this->endDate = Carbon::parse($endDate)->endOfDay();

        // Generate the report data based on type
        switch ($reportType) {
            case 'sales':
                $this->reportData = $this->generateSalesReport($this->startDate, $this->endDate);
                break;
            case 'income':
                $this->reportData = $this->generateIncomeReport($this->startDate, $this->endDate);
                break;
            case 'customer':
                $this->reportData = $this->generateCustomerReport($this->startDate, $this->endDate);
                break;
            case 'status':
                $this->reportData = $this->generateStatusReport($this->startDate, $this->endDate);
                break;
            default:
                $this->reportData = [];
        }
    }

    /**
     * Generate sales report data.
     */
    private function generateSalesReport(Carbon $startDate, Carbon $endDate)
    {
        $transactions = Transaction::with(['motor', 'user'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $data = [
            'total_transactions' => $transactions->count(),
            'total_revenue' => $transactions->sum('final_price'),
            'cash_transactions' => $transactions->where('transaction_type', 'CASH')->count(),
            'credit_transactions' => $transactions->where('transaction_type', 'CREDIT')->count(),
            'cash_revenue' => $transactions->where('transaction_type', 'CASH')->sum('final_price'),
            'credit_revenue' => $transactions->where('transaction_type', 'CREDIT')->sum('final_price'),
        ];

        // Group by motor brand
        $data['by_brand'] = $transactions->groupBy('motor.brand')->map(function ($group) {
            return [
                'count' => $group->count(),
                'revenue' => $group->sum('final_price')
            ];
        });

        // Group by motor type
        $data['by_type'] = $transactions->groupBy('motor.type')->map(function ($group) {
            return [
                'count' => $group->count(),
                'revenue' => $group->sum('final_price')
            ];
        });

        return $data;
    }

    /**
     * Generate income report data.
     */
    private function generateIncomeReport(Carbon $startDate, Carbon $endDate)
    {
        $transactions = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $data = [
            'total_income' => $transactions->sum('final_price'),
            'cash_income' => $transactions->where('transaction_type', 'CASH')->sum('final_price'),
            'credit_income' => $transactions->where('transaction_type', 'CREDIT')->sum('final_price'),
        ];

        // Group by month
        $data['by_month'] = $transactions
            ->groupBy(function ($transaction) {
                return $transaction->created_at->format('Y-m');
            })
            ->map(function ($group) {
                return [
                    'total' => $group->sum('final_price'),
                    'cash' => $group->where('transaction_type', 'CASH')->sum('final_price'),
                    'credit' => $group->where('transaction_type', 'CREDIT')->sum('final_price'),
                ];
            });

        return $data;
    }

    /**
     * Generate customer report data.
     */
    private function generateCustomerReport(Carbon $startDate, Carbon $endDate)
    {
        $transactions = Transaction::with(['user', 'motor'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $data = [
            'total_customers' => $transactions->unique('user_id')->count(),
            'new_customers' => User::whereBetween('created_at', [$startDate, $endDate])->count(),
        ];

        // Top customers by transaction count
        $data['top_customers'] = $transactions
            ->groupBy('user_id')
            ->map(function ($group) {
                $user = $group->first()->user;
                return [
                    'name' => $user->name,
                    'email' => $user->email,
                    'transaction_count' => $group->count(),
                    'total_spent' => $group->sum('final_price'),
                ];
            })
            ->sortByDesc('transaction_count')
            ->take(10)
            ->values();

        return $data;
    }

    /**
     * Generate status report data.
     */
    private function generateStatusReport(Carbon $startDate, Carbon $endDate)
    {
        $transactions = Transaction::with(['motor', 'user'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $data = [
            'total_transactions' => $transactions->count(),
        ];

        // Group by status
        $totalTransactionsCount = $transactions->count();
        $data['by_status'] = $transactions
            ->groupBy('status')
            ->map(function ($group) use ($totalTransactionsCount) {
                return [
                    'count' => $group->count(),
                    'percentage' => $totalTransactionsCount > 0 ? round(($group->count() / $totalTransactionsCount) * 100, 2) : 0,
                    'revenue' => $group->sum('final_price'),
                ];
            });

        // Group by transaction type
        $data['by_type'] = $transactions
            ->groupBy('transaction_type')
            ->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'revenue' => $group->sum('final_price'),
                ];
            });

        return $data;
    }

    public function collection()
    {
        $data = collect();

        // Add report summary information
        $data->push([
            'summary' => true,
            'title' => 'Laporan ' . $this->getReportTitle(),
            'start_date' => $this->startDate->format('d M Y'),
            'end_date' => $this->endDate->format('d M Y'),
        ]);

        $data->push([
            'summary' => true,
            'title' => ' ',
            'start_date' => ' ',
            'end_date' => ' ',
        ]);

        // Add report-specific data
        switch ($this->reportType) {
            case 'sales':
                $data = $this->addSalesData($data);
                break;
            case 'income':
                $data = $this->addIncomeData($data);
                break;
            case 'customer':
                $data = $this->addCustomerData($data);
                break;
            case 'status':
                $data = $this->addStatusData($data);
                break;
        }

        return $data;
    }

    private function getReportTitle()
    {
        switch ($this->reportType) {
            case 'sales':
                return 'Penjualan';
            case 'income':
                return 'Pendapatan';
            case 'customer':
                return 'Pelanggan';
            case 'status':
                return 'Status Transaksi';
            default:
                return ucfirst($this->reportType);
        }
    }

    private function addSalesData($data)
    {
        // Add sales summary
        $data->push([
            'summary_data' => true,
            'title' => 'Ringkasan Penjualan',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Total Transaksi',
            'value' => $this->reportData['total_transactions'] ?? 0,
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Total Pendapatan',
            'value' => 'Rp ' . number_format($this->reportData['total_revenue'] ?? 0, 0, ',', '.'),
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Transaksi Tunai',
            'value' => $this->reportData['cash_transactions'] ?? 0,
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Transaksi Kredit',
            'value' => $this->reportData['credit_transactions'] ?? 0,
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => '',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        // Add sales by brand
        $data->push([
            'summary_data' => true,
            'title' => 'Penjualan Berdasarkan Merek Motor',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Merek Motor',
            'value' => 'Jumlah Transaksi',
            'value2' => 'Total Pendapatan',
            'value3' => ''
        ]);

        if (isset($this->reportData['by_brand'])) {
            foreach ($this->reportData['by_brand'] as $brand => $stats) {
                $data->push([
                    'summary_data' => false,
                    'title' => $brand,
                    'value' => $stats['count'],
                    'value2' => 'Rp ' . number_format($stats['revenue'], 0, ',', '.'),
                    'value3' => ''
                ]);
            }
        }

        return $data;
    }

    private function addIncomeData($data)
    {
        // Add income summary
        $data->push([
            'summary_data' => true,
            'title' => 'Ringkasan Pendapatan',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Total Pendapatan',
            'value' => 'Rp ' . number_format($this->reportData['total_income'] ?? 0, 0, ',', '.'),
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Pendapatan Tunai',
            'value' => 'Rp ' . number_format($this->reportData['cash_income'] ?? 0, 0, ',', '.'),
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Pendapatan Kredit',
            'value' => 'Rp ' . number_format($this->reportData['credit_income'] ?? 0, 0, ',', '.'),
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => '',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        // Add income by month
        $data->push([
            'summary_data' => true,
            'title' => 'Pendapatan Berdasarkan Bulan',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Bulan',
            'value' => 'Total Pendapatan',
            'value2' => 'Pendapatan Tunai',
            'value3' => 'Pendapatan Kredit'
        ]);

        if (isset($this->reportData['by_month'])) {
            foreach ($this->reportData['by_month'] as $month => $stats) {
                $data->push([
                    'summary_data' => false,
                    'title' => Carbon::parse($month)->format('M Y'),
                    'value' => 'Rp ' . number_format($stats['total'] ?? 0, 0, ',', '.'),
                    'value2' => 'Rp ' . number_format($stats['cash'] ?? 0, 0, ',', '.'),
                    'value3' => 'Rp ' . number_format($stats['credit'] ?? 0, 0, ',', '.')
                ]);
            }
        }

        return $data;
    }

    private function addCustomerData($data)
    {
        // Add customer summary
        $data->push([
            'summary_data' => true,
            'title' => 'Ringkasan Pelanggan',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Total Pelanggan',
            'value' => $this->reportData['total_customers'] ?? 0,
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Pelanggan Baru',
            'value' => $this->reportData['new_customers'] ?? 0,
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => '',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        // Add top customers
        $data->push([
            'summary_data' => true,
            'title' => 'Pelanggan Teratas',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Nama',
            'value' => 'Email',
            'value2' => 'Jumlah Transaksi',
            'value3' => 'Total Dibelanjakan'
        ]);

        if (isset($this->reportData['top_customers'])) {
            foreach ($this->reportData['top_customers'] as $customer) {
                $data->push([
                    'summary_data' => false,
                    'title' => $customer['name'],
                    'value' => $customer['email'],
                    'value2' => $customer['transaction_count'],
                    'value3' => 'Rp ' . number_format($customer['total_spent'], 0, ',', '.')
                ]);
            }
        }

        return $data;
    }

    private function addStatusData($data)
    {
        // Add status summary
        $data->push([
            'summary_data' => true,
            'title' => 'Ringkasan Status Transaksi',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Total Transaksi',
            'value' => $this->reportData['total_transactions'] ?? 0,
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => '',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        // Add status breakdown
        $data->push([
            'summary_data' => true,
            'title' => 'Transaksi Berdasarkan Status',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Status',
            'value' => 'Jumlah',
            'value2' => 'Persen',
            'value3' => 'Total Pendapatan'
        ]);

        if (isset($this->reportData['by_status'])) {
            foreach ($this->reportData['by_status'] as $status => $stats) {
                $data->push([
                    'summary_data' => false,
                    'title' => $this->getTransactionStatusText($status),
                    'value' => $stats['count'],
                    'value2' => $stats['percentage'] . '%',
                    'value3' => 'Rp ' . number_format($stats['revenue'], 0, ',', '.')
                ]);
            }
        }

        $data->push([
            'summary_data' => true,
            'title' => '',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        // Add type breakdown
        $data->push([
            'summary_data' => true,
            'title' => 'Transaksi Berdasarkan Jenis',
            'value' => '',
            'value2' => '',
            'value3' => ''
        ]);

        $data->push([
            'summary_data' => true,
            'title' => 'Jenis',
            'value' => 'Jumlah',
            'value2' => 'Total Pendapatan',
            'value3' => ''
        ]);

        if (isset($this->reportData['by_type'])) {
            foreach ($this->reportData['by_type'] as $type => $stats) {
                $data->push([
                    'summary_data' => false,
                    'title' => $type === 'CASH' ? 'Tunai' : 'Kredit',
                    'value' => $stats['count'],
                    'value2' => 'Rp ' . number_format($stats['revenue'], 0, ',', '.'),
                    'value3' => ''
                ]);
            }
        }

        return $data;
    }

    public function headings(): array
    {
        return [];
    }

    public function map($row): array
    {
        if (isset($row['summary']) && $row['summary']) {
            return [
                $row['title'],
                $row['start_date'],
                $row['end_date'],
                '',
            ];
        } elseif (isset($row['summary_data']) && $row['summary_data']) {
            return [
                $row['title'],
                $row['value'],
                $row['value2'],
                $row['value3'],
            ];
        } else {
            return [
                '',
                '',
                '',
                '',
            ];
        }
    }

    public function title(): string
    {
        return 'Laporan ' . $this->getReportTitle();
    }

    public function styles(Worksheet $sheet)
    {
        $highestRow = $sheet->getHighestRow();
        
        // Style untuk header/title (baris 1)
        $sheet->getStyle('A1:D1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 14,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '043680'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_LEFT,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        
        // Set row height untuk header
        $sheet->getRowDimension(1)->setRowHeight(25);
        
        // Iterasi untuk styling rows
        for ($row = 3; $row <= $highestRow; $row++) {
            $cellA = $sheet->getCell('A' . $row)->getValue();
            
            // Section headers (Ringkasan, Berdasarkan, dll)
            if (!empty($cellA) && (
                strpos($cellA, 'Ringkasan') !== false ||
                strpos($cellA, 'Berdasarkan') !== false
            )) {
                $sheet->getStyle('A' . $row . ':D' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 12,
                        'color' => ['rgb' => 'FFFFFF'],
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '043680'],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                    ],
                ]);
                $sheet->mergeCells('A' . $row . ':D' . $row);
                $sheet->getRowDimension($row)->setRowHeight(20);
            }
            // Column headers
            elseif (!empty($cellA) && in_array($cellA, [
                'Merek Motor', 'Bulan', 'Nama', 'Status', 'Jenis'
            ])) {
                $sheet->getStyle('A' . $row . ':D' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => ['rgb' => 'FFFFFF'],
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '0652B8'],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                ]);
            }
            // Data rows
            elseif (!empty($cellA) && $cellA !== ' ') {
                // Add border to all cells
                $sheet->getStyle('A' . $row . ':D' . $row)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => 'CCCCCC'],
                        ],
                    ],
                ]);
                
                // Alternating row colors for better readability
                if ($row % 2 == 0) {
                    $sheet->getStyle('A' . $row . ':D' . $row)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => 'F8F9FA'],
                        ],
                    ]);
                }
            }
        }
        
        // Set all cells to wrap text
        $sheet->getStyle('A1:D' . $highestRow)->getAlignment()->setWrapText(true);
        
        return [];
    }

    private function getTransactionStatusText($status)
    {
        $statusMap = [
            'new_order' => 'Pesanan Baru',
            'waiting_payment' => 'Menunggu Pembayaran',
            'payment_confirmed' => 'Pembayaran Dikonfirmasi',
            'unit_preparation' => 'Persiapan Unit',
            'ready_for_delivery' => 'Siap Dikirim',
            'completed' => 'Selesai',
            'menunggu_persetujuan' => 'Menunggu Persetujuan',
            'data_tidak_valid' => 'Data Tidak Valid',
            'dikirim_ke_surveyor' => 'Dikirim ke Surveyor',
            'jadwal_survey' => 'Jadwal Survey',
            'disetujui' => 'Disetujui',
            'ditolak' => 'Ditolak',
        ];

        return $statusMap[$status] ?? $status;
    }
}