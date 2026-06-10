<?php
$transaction = \App\Models\Transaction::latest()->first();

if (!$transaction) {
    echo "No transactions found in database!\n";
    return;
}

$id = $transaction->id;
echo "=== LATEST TRANSACTION DETAILS ===\n";
echo "ID: " . $transaction->id . "\n";
echo "Ref: " . $transaction->reference_number . "\n";
echo "Type: " . $transaction->transaction_type . "\n";
echo "Status: " . $transaction->status . "\n";
echo "Created At: " . $transaction->created_at . "\n";

$creditDetail = \App\Models\CreditDetail::where('transaction_id', $id)->withTrashed()->first();
if ($creditDetail) {
    echo "\n=== CREDIT DETAIL ===\n";
    echo "ID: " . $creditDetail->id . "\n";
    echo "Status: " . $creditDetail->status . "\n";
    echo "Deleted At: " . ($creditDetail->deleted_at ?? 'Not soft deleted') . "\n";
    
    $surveySchedulesCount = \App\Models\SurveySchedule::where('credit_detail_id', $creditDetail->id)->count();
    echo "Survey Schedules Count: " . $surveySchedulesCount . "\n";
} else {
    echo "\nNo CreditDetail found for transaction ID {$id}\n";
}

$documentsCount = \App\Models\Document::where('transaction_id', $id)
    ->orWhere(function($query) use ($creditDetail) {
        if ($creditDetail) {
            $query->where('credit_detail_id', $creditDetail->id);
        } else {
            $query->whereRaw('1 = 0');
        }
    })->count();

echo "\n=== DOCUMENTS ({$documentsCount}) ===\n";

$installmentsCount = \App\Models\Installment::where('transaction_id', $id)->count();
echo "\n=== INSTALLMENTS ({$installmentsCount}) ===\n";

$logsCount = \App\Models\TransactionLog::where('transaction_id', $id)->count();
echo "\n=== TRANSACTION LOGS ({$logsCount}) ===\n";
