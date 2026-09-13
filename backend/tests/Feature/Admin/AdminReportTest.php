<?php

namespace Tests\Feature\Admin;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Motor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportExport;

class AdminReportTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    /** @test */
    public function reports_index_page_is_accessible_to_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('admin.reports.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Reports/Index'));
    }

    /** @test */
    public function admin_can_generate_sales_report()
    {
        $motor = Motor::factory()->create();
        Transaction::factory()->create([
            'motor_id' => $motor->id,
            'transaction_type' => 'CASH',
            'created_at' => now(),
            'final_price' => 20000000
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.reports.generate', [
            'type' => 'sales',
            'start_date' => now()->startOfMonth()->toDateString(),
            'end_date' => now()->endOfMonth()->toDateString(),
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Reports/Show')
            ->has('data.total_transactions')
        );
    }

    /** @test */
    public function admin_can_export_report_to_pdf()
    {
        $motor = Motor::factory()->create();
        Transaction::factory()->create([
            'motor_id' => $motor->id,
            'created_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.reports.export', [
            'type' => 'sales',
            'start_date' => now()->startOfMonth()->toDateString(),
            'end_date' => now()->endOfMonth()->toDateString(),
        ]));

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    /** @test */
    public function admin_can_export_report_to_excel()
    {
        Excel::fake();

        $response = $this->actingAs($this->admin)->get(route('admin.reports.export-excel', [
            'type' => 'sales',
            'start_date' => now()->startOfMonth()->toDateString(),
            'end_date' => now()->endOfMonth()->toDateString(),
        ]));

        $response->assertStatus(200);
        Excel::assertDownloaded('report-sales-' . now()->startOfMonth()->format('Y-m-d') . '.xlsx', function(ReportExport $export) {
            return true;
        });
    }
}
