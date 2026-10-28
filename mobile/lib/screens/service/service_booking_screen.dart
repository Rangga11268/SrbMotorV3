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

  int _currentStep = 0; // 0: Motor & Gejala, 1: Paket Servis, 2: Cabang & Jadwal

  late TextEditingController _motorModelController;
  final TextEditingController _plateController = TextEditingController();
  final TextEditingController _customComplaintController = TextEditingController();

  final Set<String> _selectedSymptoms = {'Servis Rutin / Berkala'};

  List<Branch> _branches = Branch.defaultBranches;
  Branch? _selectedBranch;

  String _selectedServiceType = 'Servis Berkala (Tune Up)';
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  String _selectedTimeSlot = '09:30';
  List<String> _availableSlots = ['08:30', '09:30', '10:30', '11:30', '13:30', '14:30', '15:30'];

  bool _isLoadingSlots = false;
  bool _isSubmitting = false;
  String? _errorMessage;

  final List<String> _commonSymptoms = [
    'Servis Rutin / Berkala',
    'Ganti Oli Mesin & Gardan',
    'Tarikan Berat / Brebet',
    'Getar pada CVT Matic',
    'Rem Berdecit / Kurang Pakem',
    'Aki / Starter Lemah',
    'Suara Mesin Kasar',
    'Lampu / Kelistrikan Mati',
  ];

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
    final init = widget.initialMotor ?? '';
    _motorModelController = TextEditingController(text: init);

    _detectNearestBranch();
    _fetchSlots();
  }

  @override
  void dispose() {
    _motorModelController.dispose();
    _plateController.dispose();
    _customComplaintController.dispose();
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

  void _goToStep(int step) {
    if (step < 0 || step > 2) return;

    // Validate step 0 before proceeding to step 1 or 2
    if (_currentStep == 0 && step > 0) {
      if (_motorModelController.text.trim().isEmpty) {
        setState(() => _errorMessage = 'Tipe / model motor wajib diisi.');
        return;
      }
      if (_plateController.text.trim().isEmpty) {
        setState(() => _errorMessage = 'Nomor polisi (plat motor) wajib diisi.');
        return;
      }
    }

    setState(() {
      _errorMessage = null;
      _currentStep = step;
    });
  }

  String _compileComplaints() {
    final symptoms = _selectedSymptoms.toList();
    final custom = _customComplaintController.text.trim();
    if (custom.isNotEmpty) {
      symptoms.add(custom);
    }
    return symptoms.join(', ');
  }

  Future<void> _submitBooking() async {
    final motorModel = _motorModelController.text.trim();
    if (motorModel.isEmpty) {
      setState(() {
        _currentStep = 0;
        _errorMessage = 'Tipe / model motor wajib diisi.';
      });
      return;
    }

    if (_plateController.text.trim().isEmpty) {
      setState(() {
        _currentStep = 0;
        _errorMessage = 'Nomor polisi (plat motor) wajib diisi.';
      });
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
      'motor_model': motorModel,
      'service_type': _selectedServiceType,
      'complaint_notes': _compileComplaints(),
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
    const textPrimary = Color(0xFF0F172A);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: textPrimary, size: 20),
          onPressed: () {
            if (_currentStep > 0) {
              setState(() => _currentStep--);
            } else {
              Navigator.pop(context);
            }
          },
        ),
        title: const Text(
          'Reservasi Servis Resmi',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textPrimary),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Stepper Progress Header
            _buildStepperHeader(),

            // Error banner if any
            if (_errorMessage != null)
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 0),
                child: Container(
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
              ),

            // Step Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Form(
                  key: _formKey,
                  child: _buildCurrentStepContent(),
                ),
              ),
            ),

            // Bottom Navigation Actions
            _buildBottomActionBar(),
          ],
        ),
      ),
    );
  }

  // Stepper Header
  Widget _buildStepperHeader() {
    const primaryColor = Color(0xFF1D4ED8);
    final steps = [
      {'num': '1', 'title': 'Motor & Gejala'},
      {'num': '2', 'title': 'Paket Servis'},
      {'num': '3', 'title': 'Cabang & Jadwal'},
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFF1F5F9))),
      ),
      child: Row(
        children: List.generate(steps.length * 2 - 1, (i) {
          if (i.isOdd) {
            final prevIndex = i ~/ 2;
            final isDone = _currentStep > prevIndex;
            return Expanded(
              child: Container(
                height: 2,
                color: isDone ? primaryColor : const Color(0xFFE2E8F0),
              ),
            );
          }

          final stepIndex = i ~/ 2;
          final isCurrent = _currentStep == stepIndex;
          final isDone = _currentStep > stepIndex;

          return InkWell(
            onTap: () {
              if (stepIndex < _currentStep) {
                setState(() => _currentStep = stepIndex);
              }
            },
            borderRadius: BorderRadius.circular(20),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isDone
                          ? const Color(0xFF16A34A)
                          : (isCurrent ? primaryColor : const Color(0xFFF1F5F9)),
                      border: Border.all(
                        color: isCurrent || isDone ? Colors.transparent : const Color(0xFFCBD5E1),
                      ),
                    ),
                    child: Center(
                      child: isDone
                          ? const Icon(Icons.check, size: 14, color: Colors.white)
                          : Text(
                              steps[stepIndex]['num']!,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: isCurrent ? Colors.white : const Color(0xFF64748B),
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    steps[stepIndex]['title']!,
                    style: TextStyle(
                      fontSize: 11.5,
                      fontWeight: isCurrent ? FontWeight.w800 : FontWeight.w600,
                      color: isCurrent ? primaryColor : const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildCurrentStepContent() {
    switch (_currentStep) {
      case 0:
        return _buildStep0MotorAndSymptoms();
      case 1:
        return _buildStep1ServicePackages();
      case 2:
      default:
        return _buildStep2BranchAndSchedule();
    }
  }

  // STEP 0: Motor & Symptoms
  Widget _buildStep0MotorAndSymptoms() {
    const primaryColor = Color(0xFF1D4ED8);
    const textPrimary = Color(0xFF0F172A);
    const textSecondary = Color(0xFF64748B);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Pilih Kendaraan Anda',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textPrimary),
        ),
        const SizedBox(height: 4),
        const Text(
          'Pilih model motor dan masukkan nomor plat untuk verifikasi riwayat servis.',
          style: TextStyle(fontSize: 12.5, color: textSecondary),
        ),
        const SizedBox(height: 16),

        // Motor Model Input
        const Text(
          'Tipe / Model Motor:',
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: _motorModelController,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: textPrimary),
          decoration: _inputDecoration(
            label: 'Model Motor',
            hint: 'contoh: Yamaha NMAX 155, Honda Beat, Vario, PCX',
            icon: Icons.two_wheeler_rounded,
          ),
          validator: (val) => (val == null || val.trim().isEmpty) ? 'Model motor wajib diisi' : null,
        ),

        const SizedBox(height: 16),

        // Plate Number Input
        const Text(
          'Nomor Polisi (Plat Motor):',
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: _plateController,
          textCapitalization: TextCapitalization.characters,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: textPrimary, letterSpacing: 1.2),
          decoration: _inputDecoration(
            label: 'Plat Nomor Kendaraan',
            hint: 'contoh: B 1234 SRB',
            icon: Icons.badge_outlined,
          ),
          validator: (val) => (val == null || val.trim().isEmpty) ? 'Plat nomor wajib diisi' : null,
        ),

        const SizedBox(height: 24),

        // Symptoms Multi-select Options
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Gejala / Kebutuhan Servis:',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary),
            ),
            Text(
              'Pilih 1 atau lebih',
              style: TextStyle(fontSize: 11, color: textSecondary.withValues(alpha: 0.8)),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _commonSymptoms.map((symptom) {
            final isSelected = _selectedSymptoms.contains(symptom);
            return FilterChip(
              label: Text(symptom),
              selected: isSelected,
              selectedColor: const Color(0xFFEFF6FF),
              backgroundColor: const Color(0xFFF8FAFC),
              labelStyle: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                color: isSelected ? primaryColor : textPrimary,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: BorderSide(
                  color: isSelected ? primaryColor : const Color(0xFFE2E8F0),
                  width: isSelected ? 1.5 : 1.0,
                ),
              ),
              showCheckmark: isSelected,
              checkmarkColor: primaryColor,
              onSelected: (checked) {
                setState(() {
                  if (checked) {
                    _selectedSymptoms.add(symptom);
                  } else {
                    if (_selectedSymptoms.length > 1) {
                      _selectedSymptoms.remove(symptom);
                    }
                  }
                });
              },
            );
          }).toList(),
        ),

        const SizedBox(height: 16),
        TextFormField(
          controller: _customComplaintController,
          maxLines: 2,
          style: const TextStyle(fontSize: 12.5, color: textPrimary),
          decoration: InputDecoration(
            hintText: 'Catatan tambahan untuk mekanik (opsional)...',
            hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
            filled: true,
            fillColor: const Color(0xFFF8FAFC),
            contentPadding: const EdgeInsets.all(12),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: primaryColor, width: 1.5),
            ),
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  // STEP 1: Service Packages
  Widget _buildStep1ServicePackages() {
    const primaryColor = Color(0xFF1D4ED8);
    const textPrimary = Color(0xFF0F172A);
    const textSecondary = Color(0xFF64748B);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Pilih Paket Perawatan',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textPrimary),
        ),
        const SizedBox(height: 4),
        const Text(
          'Pilih paket yang sesuai dengan kebutuhan motor Anda. Harga transparan & terstandar pabrik.',
          style: TextStyle(fontSize: 12.5, color: textSecondary),
        ),
        const SizedBox(height: 16),

        ..._servicePackages.map((pkg) {
          final isSelected = _selectedServiceType == pkg['title'];
          return GestureDetector(
            onTap: () => setState(() => _selectedServiceType = pkg['title'] as String),
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFFEFF6FF) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected ? primaryColor : const Color(0xFFE2E8F0),
                  width: isSelected ? 1.8 : 1.0,
                ),
                boxShadow: [
                  BoxShadow(
                    color: isSelected ? const Color(0x141D4ED8) : const Color(0x050F172A),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: isSelected ? primaryColor : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      pkg['icon'] as IconData,
                      size: 22,
                      color: isSelected ? Colors.white : const Color(0xFF475569),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                pkg['title'] as String,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                  color: isSelected ? primaryColor : textPrimary,
                                ),
                              ),
                            ),
                            Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isSelected ? primaryColor : Colors.transparent,
                                border: Border.all(
                                  color: isSelected ? primaryColor : const Color(0xFFCBD5E1),
                                  width: isSelected ? 5.5 : 1.5,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          pkg['desc'] as String,
                          style: const TextStyle(fontSize: 12, color: textSecondary, height: 1.35),
                        ),
                        const SizedBox(height: 10),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0xFFDBEAFE) : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            pkg['price'] as String,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: isSelected ? primaryColor : const Color(0xFF334155),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  // STEP 2: Branch & Schedule
  Widget _buildStep2BranchAndSchedule() {
    const primaryColor = Color(0xFF1D4ED8);
    const textPrimary = Color(0xFF0F172A);
    const textSecondary = Color(0xFF64748B);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Pilih Lokasi & Jadwal Kedatangan',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textPrimary),
        ),
        const SizedBox(height: 4),
        const Text(
          'Pilih bengkel resmi terdekat dan jam kedatangan yang sesuai dengan agenda Anda.',
          style: TextStyle(fontSize: 12.5, color: textSecondary),
        ),
        const SizedBox(height: 16),

        // Branch Selection Cards
        const Text(
          'Cabang Bengkel Resmi:',
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary),
        ),
        const SizedBox(height: 8),

        ..._branches.map((b) {
          final isSelected = _selectedBranch?.id == b.id;
          return GestureDetector(
            onTap: () {
              setState(() => _selectedBranch = b);
              _fetchSlots();
            },
            child: Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFFEFF6FF) : Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isSelected ? primaryColor : const Color(0xFFE2E8F0),
                  width: isSelected ? 1.6 : 1.0,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    b.isMainBranch ? Icons.stars_rounded : Icons.store_rounded,
                    color: isSelected ? primaryColor : const Color(0xFF64748B),
                    size: 22,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                b.name,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: isSelected ? primaryColor : textPrimary,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            if (b.formattedDistance.isNotEmpty)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: isSelected ? const Color(0xFFDBEAFE) : const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  b.formattedDistance,
                                  style: TextStyle(
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.w700,
                                    color: isSelected ? primaryColor : const Color(0xFF475569),
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          b.address,
                          style: const TextStyle(fontSize: 11, color: textSecondary),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    width: 20,
                    height: 20,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isSelected ? primaryColor : Colors.transparent,
                      border: Border.all(
                        color: isSelected ? primaryColor : const Color(0xFFCBD5E1),
                        width: isSelected ? 5.5 : 1.5,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),

        const SizedBox(height: 18),

        // Date Picker Bar
        const Text(
          'Tanggal Kedatangan:',
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary),
        ),
        const SizedBox(height: 8),
        InkWell(
          onTap: _pickDate,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
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
                  'Ubah Tanggal',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: primaryColor),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 18),

        // Time Slot Option Chips
        const Text(
          'Pilih Jam Antrean:',
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textPrimary),
        ),
        const SizedBox(height: 8),
        if (_isLoadingSlots)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 14),
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

        // Summary Preview Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: const [
                  Icon(Icons.receipt_long_rounded, color: primaryColor, size: 18),
                  SizedBox(width: 8),
                  Text(
                    'Ringkasan Reservasi',
                    style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: textPrimary),
                  ),
                ],
              ),
              const Divider(height: 20, color: Color(0xFFE2E8F0)),
              _summaryRow('Unit Motor', _motorModelController.text.trim().isNotEmpty ? _motorModelController.text.trim() : '-'),
              _summaryRow('Plat Nomor', _plateController.text.toUpperCase()),
              _summaryRow('Paket Layanan', _selectedServiceType),
              _summaryRow('Bengkel', _selectedBranch?.name ?? 'SRB Motor Pusat'),
              _summaryRow(
                'Jadwal',
                '${DateFormat('d MMM yyyy', 'id_ID').format(_selectedDate)}, Pukul $_selectedTimeSlot WIB',
              ),
              if (_selectedSymptoms.isNotEmpty)
                _summaryRow('Gejala Keluhan', _selectedSymptoms.join(', ')),
            ],
          ),
        ),

        const SizedBox(height: 20),
      ],
    );
  }

  Widget _summaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
            ),
          ),
          const Text(': ', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 12, color: Color(0xFF0F172A), fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  // Bottom Navigation Actions
  Widget _buildBottomActionBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFF1F5F9))),
      ),
      child: Row(
        children: [
          if (_currentStep > 0) ...[
            Expanded(
              flex: 1,
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  side: const BorderSide(color: Color(0xFFCBD5E1)),
                ),
                onPressed: () => setState(() => _currentStep--),
                child: const Text(
                  'Kembali',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF475569)),
                ),
              ),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            flex: 2,
            child: _currentStep < 2
                ? AppButton.primary(
                    text: 'Lanjutkan',
                    icon: Icons.arrow_forward_rounded,
                    isFullWidth: true,
                    onPressed: () => _goToStep(_currentStep + 1),
                  )
                : AppButton.primary(
                    text: 'Konfirmasi Reservasi',
                    icon: Icons.check_circle_outline_rounded,
                    isFullWidth: true,
                    isLoading: _isSubmitting,
                    onPressed: _submitBooking,
                  ),
          ),
        ],
      ),
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
