<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\CreditDetail;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Setting;
use Inertia\Inertia;


class InvoiceController extends Controller
{

    public function generate(Transaction $transaction): Response
    {
        $transaction->load(['user', 'motor', 'creditDetail', 'creditDetail.documents']);


        $pdf = Pdf::loadView('pages.admin.invoices.invoice', [
            'transaction' => $transaction,
            'logo_path' => public_path('images/icon/logo trans.png'),
            'isPdf' => true
        ]);


        $filename = 'invoice-' . $transaction->id . '.pdf';


        return $pdf->download($filename);
    }


    public function preview(Transaction $transaction): View
    {
        $transaction->load(['user', 'motor', 'creditDetail', 'creditDetail.documents']);

        return view('pages.admin.invoices.invoice', [
            'transaction' => $transaction,
            'logo_path' => asset('images/icon/logo trans.png'),
            'isPdf' => false
        ]);
    }

    /**
     * Show interactive web invoice
     */
    public function show(Transaction $transaction)
    {
        $transaction->load([
            'user', 
            'motor', 
            'creditDetail', 
            'installments' => function($q) {
                $q->orderBy('due_date', 'asc');
            }, 
            'documents'
        ]);

        return Inertia::render('Transactions/WebInvoice', [
            'transaction' => $transaction,
            'bankSettings' => [
                'name' => Setting::get('bank_name', 'Bank Central Asia (BCA)'),
                'account_number' => Setting::get('bank_account_number', '1234567890'),
                'account_name' => Setting::get('bank_account_name', 'PT SRB MOTOR INDONESIA'),
            ]
        ]);
    }
}

