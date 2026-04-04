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

        // Read and process the image
        $image = Image::read($file);
        
        // Encode as WebP with 80% quality
        $encoded = $image->toWebp(80);

        // Store the file
        Storage::disk($disk)->put($path, (string) $encoded);

        return $path;
    }
}
