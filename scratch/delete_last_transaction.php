<?php
use App\Models\Transaction;
use App\Models\CreditDetail;
use App\Models\Document;
use App\Models\Installment;
use App\Models\SurveySchedule;
use App\Models\TransactionLog;

$id = 10;
$transaction = Transaction::find($id);

if (!$transaction) {
    echo "Transaction ID {$id} not found!\n";
    return;
}

echo "Deleting transaction ID {$id} and all related records...\n";

// Start a transaction to ensure all or nothing
DB::beginTransaction();

try {
    // 1. Delete Installments
    $installmentsDeleted = Installment::where('transaction_id', $id)->delete();
    echo "Deleted {$installmentsDeleted} installments.\n";

    // 2. Delete Logs
    $logsDeleted = TransactionLog::where('transaction_id', $id)->delete();
    echo "Deleted {$logsDeleted} transaction logs.\n";

    // 3. Delete Credit Detail and its relations
    $creditDetail = CreditDetail::where('transaction_id', $id)->withTrashed()->first();
    if ($creditDetail) {
        // Delete Survey Schedules
        $surveyDeleted = SurveySchedule::where('credit_detail_id', $creditDetail->id)->delete();
        echo "Deleted {$surveyDeleted} survey schedules.\n";

        // Delete Documents (using Eloquent to trigger file deletion)
        $docs = Document::where('credit_detail_id', $creditDetail->id)->get();
        $docsCount = count($docs);
        foreach ($docs as $doc) {
            $doc->delete();
        }
        echo "Deleted {$docsCount} credit detail documents.\n";

        // Force delete credit detail
        $creditDetail->forceDelete();
        echo "Force deleted credit detail.\n";
    }

    // 4. Delete Transaction Documents (direct ones if any)
    $directDocs = Document::where('transaction_id', $id)->get();
    $directDocsCount = count($directDocs);
    foreach ($directDocs as $doc) {
        $doc->delete();
    }
    echo "Deleted {$directDocsCount} direct transaction documents.\n";

    // 5. Delete Transaction
    $transaction->delete();
    echo "Deleted transaction ID {$id}.\n";

    DB::commit();
    echo "Database transaction committed successfully.\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "Error occurred, database transaction rolled back: " . $e->getMessage() . "\n";
}
