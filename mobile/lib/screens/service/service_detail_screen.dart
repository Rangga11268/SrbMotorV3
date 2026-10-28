import 'package:flutter/material.dart';
import '../../app_state.dart';
import '../../models/service_appointment.dart';
import '../../services/api_service.dart';
import '../../widgets/app_button.dart';

class ServiceDetailScreen extends StatefulWidget {
  final ServiceAppointment appointment;
  final AppState appState;

  const ServiceDetailScreen({
    super.key,
    required this.appointment,
    required this.appState,
  });

  @override
  State<ServiceDetailScreen> createState() => _ServiceDetailScreenState();
}

class _ServiceDetailScreenState extends State<ServiceDetailScreen> {
  late ServiceAppointment _currentAppointment;
  bool _isCancelling = false;

  @override
  void initState() {
    super.initState();
    _currentAppointment = widget.appointment;
  }

  Future<void> _handleCancel() async {
    final shouldCancel = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Color(0xFFDC2626), size: 24),
            SizedBox(width: 10),
            Text('Batalkan Servis?', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: const Text(
          'Apakah Anda yakin ingin membatalkan antrean servis ini? Slot waktu Anda akan diberikan kepada pelanggan lain.',
          style: TextStyle(fontSize: 13, color: Color(0xFF475569)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Kembali', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
          ),
          AppButton.danger(
            text: 'Ya, Batalkan',
            size: AppButtonSize.small,
            onPressed: () => Navigator.pop(ctx, true),
          ),
        ],
      ),
    );

    if (shouldCancel != true || !mounted) return;

    setState(() => _isCancelling = true);

    if (widget.appState.token != null) {
      final res = await ApiService.cancelService(
        token: widget.appState.token!,
        serviceId: _currentAppointment.id,
      );

      if (!mounted) return;
      setState(() => _isCancelling = false);

      if (res.isSuccess) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Reservasi servis berhasil dibatalkan.'),
            backgroundColor: Color(0xFF16A34A),
          ),
        );
        Navigator.pop(context, true); // Pop with refresh signal
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res.message ?? 'Gagal membatalkan reservasi.'),
            backgroundColor: const Color(0xFFDC2626),
          ),
        );
      }
    } else {
      setState(() => _isCancelling = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF1D4ED8);
    const textPrimary = Color(0xFF0F172A);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: textPrimary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Tiket Antrean Servis',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textPrimary),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          children: [
            // Boarding Pass Ticket Card
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF0F172A).withValues(alpha: 0.06),
                    blurRadius: 18,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Top Ticket Header
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: const BoxDecoration(
                      color: primaryColor,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(20),
                        topRight: Radius.circular(20),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'NOMOR ANTREAN RESMI',
                              style: TextStyle(
                                color: Color(0xFFBFDBFE),
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 1.0,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _currentAppointment.queueNumber,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 32,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.5,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
                          ),
                          child: Text(
                            _currentAppointment.statusLabel.toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11.5,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.6,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Perforated Divider Visual
                  Row(
                    children: List.generate(
                      24,
                      (i) => Expanded(
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 2),
                          height: 2,
                          color: const Color(0xFFE2E8F0),
                        ),
                      ),
                    ),
                  ),

                  // Ticket Details Body
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildDetailRow(
                          icon: Icons.two_wheeler_rounded,
                          label: 'Unit & Nomor Polisi',
                          value: '${_currentAppointment.motorModel} • ${_currentAppointment.plateNumber}',
                          isHighlight: true,
                        ),
                        const SizedBox(height: 16),
                        _buildDetailRow(
                          icon: Icons.calendar_today_rounded,
                          label: 'Jadwal Kedatangan',
                          value: '${_currentAppointment.formattedDate}\nPukul ${_currentAppointment.serviceTime} WIB',
                        ),
                        const SizedBox(height: 16),
                        _buildDetailRow(
                          icon: Icons.store_rounded,
                          label: 'Bengkel Cabang',
                          value: _currentAppointment.branch,
                        ),
                        const SizedBox(height: 16),
                        _buildDetailRow(
                          icon: Icons.build_rounded,
                          label: 'Paket Servis',
                          value: _currentAppointment.serviceType,
                        ),
                        if (_currentAppointment.complaintNotes != null &&
                            _currentAppointment.complaintNotes!.trim().isNotEmpty) ...[
                          const SizedBox(height: 16),
                          _buildDetailRow(
                            icon: Icons.notes_rounded,
                            label: 'Catatan Keluhan',
                            value: _currentAppointment.complaintNotes!,
                          ),
                        ],
                      ],
                    ),
                  ),

                  // Info Reminder Footer inside card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: const BoxDecoration(
                      color: Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(20),
                        bottomRight: Radius.circular(20),
                      ),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.info_outline_rounded, size: 18, color: Color(0xFF1D4ED8)),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Tunjukkan nomor antrean ini ke Service Advisor saat tiba di bengkel resmi SRB Motor.',
                            style: TextStyle(fontSize: 11.5, color: Color(0xFF475569), height: 1.35),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Action Buttons
            if (_currentAppointment.isPending || _currentAppointment.isConfirmed) ...[
              AppButton.danger(
                text: 'Batalkan Reservasi Antrean',
                icon: Icons.cancel_outlined,
                isFullWidth: true,
                isLoading: _isCancelling,
                onPressed: _handleCancel,
              ),
              const SizedBox(height: 12),
            ],

            AppButton.outline(
              text: 'Kembali ke Daftar Servis',
              isFullWidth: true,
              onPressed: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
    bool isHighlight = false,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFFEFF6FF),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, size: 18, color: const Color(0xFF1D4ED8)),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  fontSize: isHighlight ? 14.5 : 13.5,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                  height: 1.35,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
