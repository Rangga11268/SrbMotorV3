<?php

if (!function_exists('getTransactionStatusText')) {
    function getTransactionStatusText($status) {
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
            'PENDING_REVIEW' => 'Menunggu Persetujuan',
            'DATA_INVALID' => 'Data Tidak Valid',
            'SUBMITTED_TO_SURVEYOR' => 'Dikirim ke Surveyor',
            'SURVEY_SCHEDULED' => 'Jadwal Survey',
            'APPROVED' => 'Disetujui',
            'REJECTED' => 'Ditolak'
        ];
        
        return $statusMap[$status] ?? $status;
    }
}

if (!function_exists('getCreditStatusText')) {
    function getCreditStatusText($status) {
        $statusMap = [
            'menunggu_persetujuan' => 'Menunggu Persetujuan',
            'data_tidak_valid' => 'Data Tidak Valid',
            'dikirim_ke_surveyor' => 'Dikirim ke Surveyor',
            'jadwal_survey' => 'Jadwal Survey',
            'disetujui' => 'Disetujui',
            'ditolak' => 'Ditolak',
            'PENDING_REVIEW' => 'Menunggu Persetujuan',
            'DATA_INVALID' => 'Data Tidak Valid',
            'SUBMITTED_TO_SURVEYOR' => 'Dikirim ke Surveyor',
            'SURVEY_SCHEDULED' => 'Jadwal Survey',
            'APPROVED' => 'Disetujui',
            'REJECTED' => 'Ditolak'
        ];
        
        return $statusMap[$status] ?? $status;
    }
}

if (!function_exists('formatSpecKey')) {
    function formatSpecKey($specKey) {
        $specKeyMap = [
            'engine_type' => 'Tipe Mesin:',
            'engine_size' => 'Ukuran Mesin:',
            'fuel_system' => 'Sistem Bahan Bakar:',
            'transmission' => 'Transmisi:',
            'max_power' => 'Daya Maksimal:',
            'max_torque' => 'Torsi Maksimal:',
            'additional_specs' => 'Spesifikasi Tambahan:'
        ];
        
        return $specKeyMap[$specKey] ?? __($specKey . ':');
    }
}