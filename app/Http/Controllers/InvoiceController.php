<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\CreditDetail;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;
use Barryvdh\DomPDF\Facade\Pdf;

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
}
