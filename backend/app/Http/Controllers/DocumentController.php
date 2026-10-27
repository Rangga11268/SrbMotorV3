<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DocumentController extends Controller
{
    /**
     * Preview document inline in browser (for images and PDFs).
     */
    public function preview(Document $document): BinaryFileResponse
    {
        $this->authorizeAccess($document);

        $path = $this->resolveFilePath($document->file_path);

        $mimeType = mime_content_type($path) ?: 'application/octet-stream';

        return response()->file($path, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . basename($document->original_name ?: $document->file_path) . '"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    /**
     * Download document as attachment.
     */
    public function download(Document $document): BinaryFileResponse
    {
        $this->authorizeAccess($document);

        $path = $this->resolveFilePath($document->file_path);

        return response()->download($path, $document->original_name ?: basename($document->file_path));
    }

    /**
     * Verify that the current authenticated user owns this document or is an Admin/Owner.
     */
    protected function authorizeAccess(Document $document): void
    {
        $userId = $document->transaction?->user_id ?? $document->creditDetail?->transaction?->user_id;

        $user = auth()->user();
        if (!$user) {
            abort(401, 'Silakan login terlebih dahulu.');
        }

        $isOwner = $user->id === $userId;
        $isAdmin = in_array($user->role, ['admin', 'owner']);

        if (!$isOwner && !$isAdmin) {
            abort(403, 'Anda tidak memiliki izin untuk mengakses dokumen ini.');
        }
    }

    /**
     * Resolve the absolute path of the file across private and public disks.
     */
    protected function resolveFilePath(?string $filePath): string
    {
        if (!$filePath) {
            abort(404, 'File dokumen tidak ditemukan.');
        }

        // Check local/private storage first
        if (Storage::disk('local')->exists($filePath)) {
            return Storage::disk('local')->path($filePath);
        }

        // Fallback to public storage for legacy documents
        if (Storage::disk('public')->exists($filePath)) {
            return Storage::disk('public')->path($filePath);
        }

        abort(404, 'Berkas fisik dokumen tidak ditemukan di server.');
    }
}
