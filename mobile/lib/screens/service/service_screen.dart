import 'package:flutter/material.dart';
import '../../app_state.dart';
import '../../models/service_appointment.dart';
import '../../services/api_service.dart';
import '../../widgets/app_button.dart';
import 'service_booking_screen.dart';
import 'service_detail_screen.dart';

class ServiceScreen extends StatefulWidget {
  final AppState appState;

  const ServiceScreen({super.key, required this.appState});

  @override
  State<ServiceScreen> createState() => _ServiceScreenState();
}

class _ServiceScreenState extends State<ServiceScreen> {
  bool _isLoading = true;
  List<ServiceAppointment> _appointments = [];
  String _selectedFilter = 'all'; // 'all', 'active', 'history'

  @override
  void initState() {
    super.initState();
    _fetchAppointments();
  }

  Future<void> _fetchAppointments() async {
    if (!widget.appState.isAuthenticated || widget.appState.token == null) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _appointments = [];
        });
      }
      return;
    }

    setState(() => _isLoading = true);

    final res = await ApiService.getUserServices(widget.appState.token!);

    if (mounted) {
      setState(() {
        _isLoading = false;
        if (res.isSuccess && res.data != null) {
          _appointments = res.data!.map((item) {
            return ServiceAppointment.fromJson(item as Map<String, dynamic>);
          }).toList();
        }
      });
    }
  }

  List<ServiceAppointment> get _filteredAppointments {
    if (_selectedFilter == 'active') {
      return _appointments.where((a) => a.isPending || a.isConfirmed || a.isInProgress).toList();
    } else if (_selectedFilter == 'history') {
      return _appointments.where((a) => a.isCompleted || a.isCancelled).toList();
    }
    return _appointments;
  }

  void _openBooking() async {
    if (!widget.appState.isAuthenticated) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Silakan login terlebih dahulu untuk booking antrean servis.'),
          backgroundColor: Color(0xFFDC2626),
        ),
      );
      Navigator.pushNamed(context, '/login');
      return;
    }

    final refresh = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (context) => ServiceBookingScreen(appState: widget.appState),
      ),
    );

    if (refresh == true) {
      _fetchAppointments();
    }
  }

  void _openDetail(ServiceAppointment appointment) async {
    final refresh = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (context) => ServiceDetailScreen(
          appointment: appointment,
          appState: widget.appState,
        ),
      ),
    );

    if (refresh == true) {
      _fetchAppointments();
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF1D4ED8);
    const textPrimary = Color(0xFF0F172A);
    const textSecondary = Color(0xFF64748B);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            Image.asset(
              'assets/images/logos/logo_srb.webp',
              height: 28,
              fit: BoxFit.contain,
              errorBuilder: (context, error, stackTrace) => const Icon(
                Icons.two_wheeler_rounded,
                color: primaryColor,
                size: 24,
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'LAYANAN SERVIS RESMI',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w900,
                color: textPrimary,
                letterSpacing: 0.8,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: textSecondary, size: 22),
            onPressed: _fetchAppointments,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _fetchAppointments,
        color: primaryColor,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hero Booking Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1D4ED8), Color(0xFF1E40AF), Color(0xFF0F172A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF1D4ED8).withValues(alpha: 0.25),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.verified_rounded, size: 14, color: Colors.white),
                          SizedBox(width: 6),
                          Text(
                            'BENGKEL RESMI YAMAHA & HONDA',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              letterSpacing: 0.6,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    const Text(
                      'Perawatan Berkala Motor Anda Tanpa Antre',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: -0.4,
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Pesan nomor antrean servis sekarang. Teknisi bersertifikat, suku cadang 100% orisinil, dan garansi servis resmi.',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFFDBEAFE),
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 20),
                    AppButton.primary(
                      text: 'Booking Servis Sekarang',
                      icon: Icons.calendar_month_rounded,
                      isFullWidth: true,
                      onPressed: _openBooking,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Filter Tabs
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Riwayat Antrean Servis',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textPrimary),
                  ),
                  Row(
                    children: [
                      _buildFilterChip('Semua', 'all'),
                      const SizedBox(width: 6),
                      _buildFilterChip('Aktif', 'active'),
                      const SizedBox(width: 6),
                      _buildFilterChip('Selesai', 'history'),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Content List
              if (_isLoading)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: Center(
                    child: CircularProgressIndicator(color: primaryColor, strokeWidth: 2.2),
                  ),
                )
              else if (!widget.appState.isAuthenticated)
                _buildGuestPrompt()
              else if (_filteredAppointments.isEmpty)
                _buildEmptyState()
              else
                ..._filteredAppointments.map((item) => _buildAppointmentCard(item)),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _selectedFilter == value;
    return InkWell(
      onTap: () => setState(() => _selectedFilter = value),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF1D4ED8) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF1D4ED8) : const Color(0xFFE2E8F0),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.w700,
            color: isSelected ? Colors.white : const Color(0xFF64748B),
          ),
        ),
      ),
    );
  }

  Widget _buildAppointmentCard(ServiceAppointment item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: InkWell(
        onTap: () => _openDetail(item),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header card
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1D4ED8),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          item.queueNumber,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        item.plateNumber,
                        style: const TextStyle(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: item.statusBgColor,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      item.statusLabel,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: item.statusColor,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(color: Color(0xFFF1F5F9), height: 1),
              const SizedBox(height: 12),
              // Body
              Row(
                children: [
                  const Icon(Icons.build_rounded, size: 16, color: Color(0xFF64748B)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '${item.serviceType} • ${item.motorModel}',
                      style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.calendar_today_rounded, size: 16, color: Color(0xFF64748B)),
                  const SizedBox(width: 8),
                  Text(
                    '${item.serviceDate} • Jam ${item.serviceTime} WIB',
                    style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.store_rounded, size: 16, color: Color(0xFF64748B)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      item.branch,
                      style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Color(0xFF94A3B8)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Color(0xFFEFF6FF),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.build_circle_outlined, size: 48, color: Color(0xFF1D4ED8)),
          ),
          const SizedBox(height: 16),
          const Text(
            'Belum Ada Jadwal Servis',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 6),
          const Text(
            'Pesan antrean servis sekarang untuk perawatan motor rutin Anda di bengkel resmi SRB Motor terdekat.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B), height: 1.4),
          ),
          const SizedBox(height: 20),
          AppButton.outline(
            text: 'Jadwalkan Servis Baru',
            icon: Icons.calendar_month_rounded,
            onPressed: _openBooking,
          ),
        ],
      ),
    );
  }

  Widget _buildGuestPrompt() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          const Icon(Icons.lock_outline_rounded, size: 40, color: Color(0xFF1D4ED8)),
          const SizedBox(height: 12),
          const Text(
            'Masuk untuk Mengelola Servis',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 6),
          const Text(
            'Silakan masuk ke akun SRB Motor Anda untuk melihat riwayat perawatan motor atau membuat reservasi servis baru.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B), height: 1.4),
          ),
          const SizedBox(height: 18),
          AppButton.primary(
            text: 'Masuk ke Akun',
            icon: Icons.login_rounded,
            onPressed: () => Navigator.pushNamed(context, '/login'),
          ),
        ],
      ),
    );
  }
}
