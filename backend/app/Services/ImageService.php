<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Process an uploaded image: Convert to WebP and compress.
     *
     * @param UploadedFile $file
     * @param string $directory
     * @param string $disk
     * @return string
     */
    public static function uploadAndConvert(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        // Generate a unique filename with .webp extension
        $filename = Str::random(40) . '.webp';
        $path = $directory . '/' . $filename;

        // Read and process the image (Robust version checking)
        $manager = Image::getFacadeRoot();
        \Log::info('Image Manager Diagnostic:', [
            'class' => get_class($manager),
            'methods' => get_class_methods($manager),
        ]);

        try {
            // Attempt v3 style (read & toWebp)
            $image = Image::read($file);
            $encoded = $image->toWebp(80);
            Storage::disk($disk)->put($path, (string) $encoded);
        } catch (\Throwable $e3) {
            try {
                // Attempt v2 style (make & encode)
                $image = Image::make($file);
                $encoded = $image->encode('webp', 80);
                Storage::disk($disk)->put($path, (string) $encoded);
            } catch (\Throwable $e2) {
                // Final fallback: Store original file without conversion
                \Log::warning('Image processing failed, storing original:', ['error' => $e2->getMessage()]);
                return $file->store($directory, $disk);
            }
        }

        return $path;
    }
}
