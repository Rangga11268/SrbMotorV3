import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../app_state.dart';
import '../../models/branch.dart';
import '../../models/service_appointment.dart';
import '../../services/api_service.dart';
import '../../services/location_service.dart';
import '../../widgets/app_button.dart';
import 'service_detail_screen.dart';

class ServiceBookingScreen extends StatefulWidget {
  final AppState appState;
  final String? initialMotor;

  const ServiceBookingScreen({
    super.key,
    required this.appState,
    this.initialMotor,
  });

  @override
  State<ServiceBookingScreen> createState() => _ServiceBookingScreenState();
}

class _ServiceBookingScreenState extends State<ServiceBookingScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _motorModelController;
  final TextEditingController _plateController = TextEditingController();
  final TextEditingController _complaintController = TextEditingController();

  List<Branch> _branches = Branch.defaultBranches;
  Branch? _selectedBranch;

  String _selectedServiceType = 'Servis Berkala (Tune Up)';
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  String _selectedTimeSlot = '09:30';
  List<String> _availableSlots = ['08:30', '09:30', '10:30', '11:30', '13:30', '14:30', '15:30'];

  bool _isLoadingSlots = false;
  bool _isSubmitting = false;
  String? _errorMessage;

  final List<Map<String, dynamic>> _servicePackages = [
    {
      'title': 'Servis Berkala (Tune Up)',
      'desc': 'Pemeriksaan 15 titik injeksi, kelistrikan, busi, dan filter udara.',
      'price': 'Rp 95.000',
      'icon': Icons.tune_rounded,
    },
    {
      'title': 'Paket Ganti Oli + Servis Ringan',
      'desc': 'Tune up lengkap + oli mesin resmi pabrikan Yamalube/AHM Oil.',
      'price': 'Rp 145.000',
      'icon': Icons.oil_barrel_rounded,
    },
    {
      'title': 'Servis Lengkap + CVT Matic',
      'desc': 'Pembersihan mangkok ganda, roller, v-belt & pelumasan grease.',
      'price': 'Rp 195.000',
      'icon': Icons.settings_suggest_rounded,
    },
    {
      'title': 'Pemeriksaan Keluhan Khusus',
      'desc': 'Diagnosa kendala mesin, kelistrikan, kaki-kaki, atau pengereman.',
      'price': 'Estimasi di Bengkel',
      'icon': Icons.healing_rounded,
    },
  ];

  @override
  void initState() {
    super.initState();
    _motorModelController = TextEditingController(text: widget.initialMotor ?? 'Yamaha NMAX');
    _detectNearestBranch();
    _fetchSlots();
  }

  @override
  void dispose() {
    _motorModelController.dispose();
    _plateController.dispose();
    _complaintController.dispose();
    super.dispose();
  }

  Future<void> _detectNearestBranch() async {
    try {
      final loc = await LocationService.getCurrentPosition();
      if (loc != null) {
        final sorted = Branch.sortByProximity(Branch.defaultBranches, loc.latitude, loc.longitude);
        if (sorted.isNotEmpty && mounted) {
          setState(() {
            _branches = sorted;
            _selectedBranch = sorted.first;
          });
          _fetchSlots();
        }
      } else {
        if (mounted) {
          setState(() {
            _selectedBranch = _branches.firstWhere((b) => b.isMainBranch, orElse: () => _branches.first);
          });
        }
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _selectedBranch = _branches.firstWhere((b) => b.isMainBranch, orElse: () => _branches.first);
        });
      }
    }
  }

  Future<void> _fetchSlots() async {
    if (_selectedBranch == null) return;
    setState(() => _isLoadingSlots = true);

    final dateStr = DateFormat('yyyy-MM-dd').format(_selectedDate);
    final res = await ApiService.getAvailableSlots(
      branch: _selectedBranch!.name,
      date: dateStr,
    );

    if (mounted) {
      setState(() {
        _isLoadingSlots = false;
        if (res.isSuccess && res.data != null && res.data!.isNotEmpty) {
          _availableSlots = res.data!;
          if (!_availableSlots.contains(_selectedTimeSlot)) {
            _selectedTimeSlot = _availableSlots.first;
          }
        }
      });
    }
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final first = now.hour >= 16 ? now.add(const Duration(days: 1)) : now;
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate.isBefore(first) ? first : _selectedDate,
      firstDate: first,
      lastDate: now.add(const Duration(days: 30)),
      locale: const Locale('id', 'ID'),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF1D4ED8),
              onPrimary: Colors.white,
              onSurface: Color(0xFF0F172A),
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
      _fetchSlots();
    }
  }

  Future<void> _submitBooking() async {
    if (!_formKey.currentState!.validate()) return;

    if (_plateController.text.trim().isEmpty) {
      setState(() => _errorMessage = 'Nomor polisi (plat motor) wajib diisi.');
      return;
    }

    if (!widget.appState.isAuthenticated || widget.appState.token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Silakan login terlebih dahulu untuk melakukan reservasi servis.'),
          backgroundColor: Color(0xFFDC2626),
        ),
      );
      Navigator.pushNamed(context, '/login');
      return;
    }

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    final payload = {
      'branch': _selectedBranch?.name ?? 'SRB Motor Pusat',
      'plate_number': _plateController.text.trim().toUpperCase(),
      'service_date': DateFormat('yyyy-MM-dd').format(_selectedDate),
      'service_time': _selectedTimeSlot,
      'motor_model': _motorModelController.text.trim(),
      'service_type': _selectedServiceType,
      'complaint_notes': _complaintController.text.trim(),
    };

    final res = await ApiService.bookService(
      token: widget.appState.token!,
      data: payload,
    );

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (res.isSuccess && res.data != null && res.data!['appointment'] != null) {
      final appointment = ServiceAppointment.fromJson(res.data!['appointment'] as Map<String, dynamic>);

      // Navigate to ticket screen and pop booking screen
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => ServiceDetailScreen(
            appointment: appointment,
            appState: widget.appState,
          ),
        ),
      );
    } else {
      setState(() {
        _errorMessage = res.message ?? 'Gagal membuat antrean. Periksa kembali jadwal yang dipilih.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF1D4ED8);
    const textPrimary = Color(0xFF0F172A);
    const textSecondary = Color(0xFF64748B);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: textPrimary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Reservasi Servis Resmi',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textPrimary),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Intro
              const Text(
                'Jadwalkan Servis Tanpa Antre',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: textPrimary, letterSpacing: -0.5),
              ),
              const SizedBox(height: 6),
              const Text(
                'Dapatkan jaminan mekanik handal, suku cadang asli, dan ruang tunggu ber-AC di seluruh bengkel resmi SRB Motor.',
                style: TextStyle(fontSize: 13, color: textSecondary, height: 1.45),
              ),
              const SizedBox(height: 24),

              // Error alert
              if (_errorMessage != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF2F2),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFFFECACA)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.error_outline_rounded, color: Color(0xFFDC2626), size: 18),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          _errorMessage!,
                          style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: Color(0xFFDC2626)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
              ],

              // Section 1: Kendaraan & Plat
              _buildSectionTitle('1. Identitas Kendaraan'),
              const SizedBox(height: 10),
              TextFormField(
                controller: _motorModelController,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: textPrimary),
                decoration: _inputDecoration(
                  label: 'Tipe / Model Motor',
                  hint: 'contoh: Yamaha NMAX 155, Honda Beat',
                  icon: Icons.two_wheeler_rounded,
                ),
                validator: (val) => (val == null || val.trim().isEmpty) ? 'Model motor wajib diisi' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _plateController,
                textCapitalization: TextCapitalization.characters,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: textPrimary, letterSpacing: 1.0),
                decoration: _inputDecoration(
                  label: 'Nomor Polisi (Plat Motor)',
                  hint: 'contoh: D 1234 ABC',
                  icon: Icons.badge_outlined,
                ),
                validator: (val) => (val == null || val.trim().isEmpty) ? 'Nomor polisi wajib diisi' : null,
              ),

              const SizedBox(height: 24),

              // Section 2: Pilih Paket Servis
              _buildSectionTitle('2. Pilih Paket Layanan Servis'),
              const SizedBox(height: 10),
              ..._servicePackages.map((pkg) {
                final isSelected = _selectedServiceType == pkg['title'];
                return GestureDetector(
                  onTap: () => setState(() => _selectedServiceType = pkg['title'] as String),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFEFF6FF) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isSelected ? primaryColor : const Color(0xFFE2E8F0),
                        width: isSelected ? 1.6 : 1.0,
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: isSelected ? primaryColor : Colors.white,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(
                            pkg['icon'] as IconData,
                            size: 18,
                            color: isSelected ? Colors.white : const Color(0xFF64748B),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                pkg['title'] as String,
                                style: TextStyle(
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.w700,
                                  color: isSelected ? primaryColor : textPrimary,
                                ),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                pkg['desc'] as String,
                                style: const TextStyle(fontSize: 11.5, color: textSecondary, height: 1.3),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          pkg['price'] as String,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: isSelected ? primaryColor : textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),

              const SizedBox(height: 20),

              // Section 3: Cabang Bengkel
              _buildSectionTitle('3. Pilih Cabang Bengkel Resmi'),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<Branch>(
                    isExpanded: true,
                    value: _selectedBranch ?? (_branches.isNotEmpty ? _branches.first : null),
                    items: _branches.map((b) {
                      return DropdownMenuItem<Branch>(
                        value: b,
                        child: Row(
                          children: [
                            const Icon(Icons.store_rounded, size: 18, color: primaryColor),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                '${b.name} ${b.formattedDistance.isNotEmpty ? '(${b.formattedDistance})' : ''}',
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setState(() => _selectedBranch = val);
                        _fetchSlots();
                      }
                    },
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Section 4: Jadwal & Jam Antrean
              _buildSectionTitle('4. Tanggal & Waktu Kedatangan'),
              const SizedBox(height: 10),
              InkWell(
                onTap: _pickDate,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.calendar_today_rounded, size: 18, color: primaryColor),
                          const SizedBox(width: 10),
                          Text(
                            DateFormat('EEEE, d MMMM yyyy', 'id_ID').format(_selectedDate),
                            style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w700, color: textPrimary),
                          ),
                        ],
                      ),
                      const Text(
                        'Ubah',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: primaryColor),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Pilih Jam Kedatangan:',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: textSecondary),
              ),
              const SizedBox(height: 8),
              if (_isLoadingSlots)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Center(
                    child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)),
                  ),
                )
              else
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _availableSlots.map((slot) {
                    final isSlotSelected = _selectedTimeSlot == slot;
                    return ChoiceChip(
                      label: Text(slot),
                      selected: isSlotSelected,
                      selectedColor: primaryColor,
                      backgroundColor: const Color(0xFFF1F5F9),
                      labelStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isSlotSelected ? Colors.white : textPrimary,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                        side: BorderSide(color: isSlotSelected ? primaryColor : const Color(0xFFE2E8F0)),
                      ),
                      showCheckmark: false,
                      onSelected: (_) => setState(() => _selectedTimeSlot = slot),
                    );
                  }).toList(),
                ),

              const SizedBox(height: 24),

              // Section 5: Catatan Keluhan
              _buildSectionTitle('5. Keluhan Khusus (Opsional)'),
              const SizedBox(height: 10),
              TextFormField(
                controller: _complaintController,
                maxLines: 3,
                style: const TextStyle(fontSize: 13, color: textPrimary),
                decoration: InputDecoration(
                  hintText: 'Tuliskan keluhan atau gejala kerusakan jika ada (misal: mesin brebet, rem decit)...',
                  hintStyle: const TextStyle(fontSize: 12.5, color: Color(0xFF94A3B8)),
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  contentPadding: const EdgeInsets.all(14),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: primaryColor, width: 1.6),
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // Submit Button
              AppButton.primary(
                text: 'Konfirmasi Reservasi Servis',
                icon: Icons.check_circle_outline_rounded,
                isFullWidth: true,
                isLoading: _isSubmitting,
                onPressed: _submitBooking,
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A), letterSpacing: -0.2),
    );
  }

  InputDecoration _inputDecoration({required String label, required String hint, required IconData icon}) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
      hintText: hint,
      hintStyle: const TextStyle(fontSize: 12.5, color: Color(0xFF94A3B8)),
      prefixIcon: Icon(icon, color: const Color(0xFF64748B), size: 19),
      filled: true,
      fillColor: const Color(0xFFF8FAFC),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF1D4ED8), width: 1.6),
      ),
    );
  }
}
