import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import '../../app_state.dart';
import '../../core/constants.dart';
import '../../models/motor.dart';
import '../../models/branch.dart';
import '../../services/api_service.dart';
import '../../widgets/motor_image_view.dart';
import '../../widgets/app_selection_chip.dart';
import 'midtrans_payment_screen.dart';

class OrderCheckoutScreen extends StatefulWidget {
  final Motor motor;
  final AppState appState;
  final bool isCredit;

  const OrderCheckoutScreen({
    super.key,
    required this.motor,
    required this.appState,
    this.isCredit = false,
  });

  @override
  State<OrderCheckoutScreen> createState() => _OrderCheckoutScreenState();
}

class _OrderCheckoutScreenState extends State<OrderCheckoutScreen> {
  int _currentStep = 0;
  bool _isSubmitting = false;

  // Step 1: Unit & Delivery
  String? _selectedColor;
  String get selectedColor => _selectedColor ?? (widget.motor.colors.isNotEmpty ? widget.motor.colors.first : 'Hitam');

  List<Branch>? _branches;
  List<Branch> get branches => _branches ?? Branch.defaultBranches;

  Branch? _selectedBranch;
  Branch get selectedBranch {
    final list = branches;
    if (_selectedBranch != null && list.any((b) => b.code == _selectedBranch!.code)) {
      return _selectedBranch!;
    }
    return list.firstWhere((b) => b.isMainBranch, orElse: () => list.first);
  }

  String _deliveryMethod = 'Kirim ke Alamat Rumah';

  // Step 2: Personal Info
  final _formKeyPersonal = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _nikController = TextEditingController();
  final _addressController = TextEditingController();

  // Credit extra fields
  final _occupationController = TextEditingController();
  final _incomeController = TextEditingController();
  final _employmentDurationController = TextEditingController();

  // Step 3: Financing (Credit) or Payment Type (Cash)
  double? _dpAmount;
  double get dpAmount {
    if (_dpAmount != null && _dpAmount! >= _minDp) return _dpAmount!;
    return _minDp;
  }

  int? _selectedTenor;
  int get selectedTenor => _selectedTenor ?? 35;
  List<int> get tenorOptions => const [11, 17, 23, 29, 35];

  // Cash options
  bool _isBookingFee = false;
  final double _bookingFeeAmount = 500000;
  String _paymentMethod = 'Transfer Bank'; // Transfer Bank (Midtrans) or Tunai / Bayar di Tempat

  // Step 4: Documents & Agreements
  final ImagePicker _picker = ImagePicker();
  XFile? _ktpFile;
  XFile? _kkFile;
  bool _agreeTerms = true;

  @override
  void initState() {
    super.initState();
    _selectedColor = widget.motor.colors.isNotEmpty ? widget.motor.colors.first : 'Hitam';
    _branches = Branch.defaultBranches;
    _selectedBranch = branches.firstWhere((b) => b.isMainBranch, orElse: () => branches.first);
    _loadBranches();

    // Pre-fill user data if logged in
    final user = widget.appState.user;
    if (user != null) {
      _nameController.text = user.name;
      _emailController.text = user.email;
      _phoneController.text = (user.phone != '-' && user.phone.isNotEmpty) ? user.phone : '';
      _addressController.text = user.address ?? '';
    }

    // Default DP for credit (min 20% of motor price)
    final minDpCalc = widget.motor.minDp > 0 ? widget.motor.minDp : (widget.motor.price * 0.2);
    _dpAmount = minDpCalc;

    _occupationController.text = 'Karyawan Swasta';
    _incomeController.text = '6500000';
    _employmentDurationController.text = '2 Tahun';
  }

  Future<void> _loadBranches() async {
    final res = await ApiService.getBranches();
    if (res.isSuccess && res.data != null && res.data!.isNotEmpty) {
      if (mounted) {
        setState(() {
          _branches = res.data!;
          _selectedBranch = branches.firstWhere(
            (b) => b.code == _selectedBranch?.code || b.isMainBranch,
            orElse: () => branches.first,
          );
        });
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _nikController.dispose();
    _addressController.dispose();
    _occupationController.dispose();
    _incomeController.dispose();
    _employmentDurationController.dispose();
    super.dispose();
  }

  int get _totalSteps => widget.isCredit ? 4 : 3;

  double get _minDp => widget.motor.minDp > 0 ? widget.motor.minDp : (widget.motor.price * 0.2);

  double get _loanAmount => (widget.motor.price - dpAmount).clamp(0, widget.motor.price);

  double get _monthlyInstallment {
    if (!widget.isCredit || selectedTenor <= 0) return 0;
    const interestRate = 0.015; // 1.5% flat per month
    final totalInterest = _loanAmount * interestRate * selectedTenor;
    return (_loanAmount + totalInterest) / selectedTenor;
  }

  String _formatRupiah(num value) {
    return NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0).format(value);
  }

  Future<void> _pickDocument({required bool isKtp}) async {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Pilih Sumber Foto ${isKtp ? "KTP" : "Kartu Keluarga"}',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: const CircleAvatar(
                  backgroundColor: Color(0xFFEFF6FF),
                  child: Icon(Icons.camera_alt_rounded, color: AppColors.primary),
                ),
                title: const Text('Ambil dari Kamera', style: TextStyle(fontWeight: FontWeight.w600)),
                subtitle: const Text('Pastikan dokumen terang dan tidak buram'),
                onTap: () async {
                  Navigator.of(ctx).pop();
                  final file = await _picker.pickImage(source: ImageSource.camera, imageQuality: 85);
                  if (file != null) {
                    setState(() {
                      if (isKtp) {
                        _ktpFile = file;
                      } else {
                        _kkFile = file;
                      }
                    });
                  }
                },
              ),
              ListTile(
                leading: const CircleAvatar(
                  backgroundColor: Color(0xFFEFF6FF),
                  child: Icon(Icons.photo_library_rounded, color: AppColors.primary),
                ),
                title: const Text('Pilih dari Galeri', style: TextStyle(fontWeight: FontWeight.w600)),
                subtitle: const Text('Format JPG, JPEG, PNG'),
                onTap: () async {
                  Navigator.of(ctx).pop();
                  final file = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
                  if (file != null) {
                    setState(() {
                      if (isKtp) {
                        _ktpFile = file;
                      } else {
                        _kkFile = file;
                      }
                    });
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _onNextStep() {
    if (_currentStep == 1) {
      if (!_formKeyPersonal.currentState!.validate()) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Lengkapi kolom yang wajib diisi terlebih dahulu'),
            backgroundColor: Color(0xFFDC2626),
          ),
        );
        return;
      }
    }

    if (_currentStep < _totalSteps - 1) {
      setState(() => _currentStep++);
    } else {
      _submitOrder();
    }
  }

  void _onPrevStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    } else {
      Navigator.of(context).pop();
    }
  }

  Future<void> _submitOrder() async {
    if (!_agreeTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Anda harus menyetujui syarat & ketentuan pemesanan.'),
          backgroundColor: Color(0xFFDC2626),
        ),
      );
      return;
    }

    if (!widget.appState.isLoggedIn || widget.appState.token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Silakan login terlebih dahulu untuk melakukan pemesanan.'),
          backgroundColor: Color(0xFFDC2626),
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    final token = widget.appState.token!;

    try {
      if (widget.isCredit) {
        final monthlyIncome = double.tryParse(_incomeController.text.replaceAll(RegExp(r'[^0-9]'), '')) ?? 5000000;
        final res = await ApiService.createCreditOrder(
          token: token,
          data: {
            'motor_id': widget.motor.id,
            'customer_name': _nameController.text.trim(),
            'customer_phone': _phoneController.text.trim(),
            'customer_email': _emailController.text.trim(),
            'customer_nik': _nikController.text.trim(),
            'customer_address': _addressController.text.trim(),
            'motor_color': selectedColor,
            'delivery_method': _deliveryMethod,
            'payment_method': _paymentMethod,
            'occupation': _occupationController.text.trim(),
            'monthly_income': monthlyIncome,
            'employment_duration': _employmentDurationController.text.trim(),
            'dp_amount': dpAmount,
            'tenor': selectedTenor,
            'branch': selectedBranch.name,
            'branch_code': selectedBranch.code,
          },
          ktpFilePath: _ktpFile?.path,
          kkFilePath: _kkFile?.path,
        );

        if (res.isSuccess) {
          _showCreditSuccessDialog(res.data?['order_id']?.toString() ?? 'ID');
        } else {
          _showError(res.errorMessage ?? 'Gagal membuat pengajuan kredit.');
        }
      } else {
        // Cash Order
        final fee = _isBookingFee ? _bookingFeeAmount : 0;
        final res = await ApiService.createCashOrder(
          token: token,
          data: {
            'motor_id': widget.motor.id,
            'customer_name': _nameController.text.trim(),
            'customer_phone': _phoneController.text.trim(),
            'customer_email': _emailController.text.trim(),
            'customer_nik': _nikController.text.trim(),
            'customer_address': _addressController.text.trim(),
            'motor_color': selectedColor,
            'delivery_method': _deliveryMethod,
            'payment_method': _paymentMethod,
            'booking_fee': fee,
            'branch': selectedBranch.name,
            'branch_code': selectedBranch.code,
          },
          ktpFilePath: _ktpFile?.path,
          kkFilePath: _kkFile?.path,
        );

        if (res.isSuccess) {
          final redirectUrl = res.data?['redirect_url']?.toString();
          final orderId = res.data?['order_id']?.toString() ?? 'ORD';

          if (_paymentMethod == 'Transfer Bank' && redirectUrl != null && redirectUrl.isNotEmpty) {
            // Open In-App Midtrans WebView!
            if (!mounted) return;
            final paymentResult = await Navigator.of(context).push<PaymentResult>(
              MaterialPageRoute(
                builder: (ctx) => MidtransPaymentScreen(
                  snapUrl: redirectUrl,
                  orderReference: orderId,
                ),
              ),
            );

            if (!mounted) return;
            _handlePaymentReturn(paymentResult ?? PaymentResult.pending, orderId);
          } else {
            _showCashSuccessDialog(orderId, isOnline: false);
          }
        } else {
          _showError(res.errorMessage ?? 'Gagal membuat pesanan tunai.');
        }
      }
    } catch (e) {
      _showError('Terjadi kesalahan: $e');
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _handlePaymentReturn(PaymentResult result, String orderId) {
    if (result == PaymentResult.success) {
      _showCashSuccessDialog(orderId, isOnline: true);
    } else {
      // Pending or cancelled
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(
            children: [
              Icon(Icons.info_outline, color: Color(0xFFD97706)),
              SizedBox(width: 8),
              Text('Status Pembayaran'),
            ],
          ),
          content: Text(
            'Pesanan #$orderId telah tercatat. Anda dapat menyelesaikan pembayaran melalui menu Transaksi sewaktu-waktu.',
            style: const TextStyle(fontSize: 14),
          ),
          actions: [
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pop(true);
              },
              child: const Text('Ke Menu Pesanan'),
            ),
          ],
        ),
      );
    }
  }

  void _showCashSuccessDialog(String orderId, {required bool isOnline}) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Color(0xFFECFDF5),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle_rounded, color: Color(0xFF059669), size: 48),
              ),
              const SizedBox(height: 16),
              Text(
                isOnline ? 'Pembayaran Berhasil!' : 'Pesanan Tunai Diterima!',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Pesanan unit ${widget.motor.name} dengan referensi #$orderId telah berhasil dibuat.',
                style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pop(true);
              },
              child: const Text('Lihat Pesanan Saya', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  void _showCreditSuccessDialog(String orderId) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Color(0xFFEFF6FF),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.assignment_turned_in_rounded, color: Color(0xFF1C69D4), size: 48),
              ),
              const SizedBox(height: 16),
              const Text(
                'Pengajuan Kredit Terkirim!',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Data pengajuan unit ${widget.motor.name} sedang diproses oleh tim surveyor SRB Motor. Anda dapat memantau status survei di menu Transaksi.',
                style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pop(true);
              },
              child: const Text('Buka Riwayat Pengajuan', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: const Color(0xFFDC2626),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.isCredit ? 'Pengajuan Kredit' : 'Checkout Pembelian';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          title,
          style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Color(0xFF0F172A)),
          onPressed: _onPrevStep,
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(64),
          child: _buildStepperHeader(),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: _buildStepContent(),
              ),
            ),
            _buildBottomActionBar(),
          ],
        ),
      ),
    );
  }

  // Visual Stepper Header
  Widget _buildStepperHeader() {
    final stepLabels = widget.isCredit
        ? ['Unit', 'Identitas', 'Simulasi', 'Ringkasan']
        : ['Unit', 'Identitas', 'Ringkasan'];

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
      child: Row(
        children: List.generate(stepLabels.length * 2 - 1, (index) {
          if (index.isOdd) {
            final stepIdx = index ~/ 2;
            final isPassed = _currentStep > stepIdx;
            return Expanded(
              child: Container(
                height: 2,
                color: isPassed ? AppColors.primary : const Color(0xFFE2E8F0),
              ),
            );
          } else {
            final stepIdx = index ~/ 2;
            final isCurrent = _currentStep == stepIdx;
            final isDone = _currentStep > stepIdx;

            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: isDone
                        ? AppColors.primary
                        : (isCurrent ? AppColors.primary : const Color(0xFFF1F5F9)),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isCurrent || isDone ? AppColors.primary : const Color(0xFFCBD5E1),
                      width: 1.5,
                    ),
                  ),
                  child: Center(
                    child: isDone
                        ? const Icon(Icons.check, size: 16, color: Colors.white)
                        : Text(
                            '${stepIdx + 1}',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: isCurrent ? Colors.white : const Color(0xFF64748B),
                            ),
                          ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  stepLabels[stepIdx],
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                    color: isCurrent ? AppColors.primary : const Color(0xFF64748B),
                  ),
                ),
              ],
            );
          }
        }),
      ),
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return _buildStepUnitAndDelivery();
      case 1:
        return _buildStepPersonalInfo();
      case 2:
        return widget.isCredit ? _buildStepFinancing() : _buildStepSummaryAndPayment();
      case 3:
        return _buildStepSummaryAndPayment();
      default:
        return const SizedBox();
    }
  }

  // STEP 1: Unit & Delivery
  Widget _buildStepUnitAndDelivery() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Motor Card Preview
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: 80,
                  height: 70,
                  color: const Color(0xFFF8FAFC),
                  child: MotorImageView(
                    imageUrl: widget.motor.displayImageUrl,
                    assetPath: widget.motor.imagePath,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEFF6FF),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        widget.motor.brand.toUpperCase(),
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.primary),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      widget.motor.name,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      widget.motor.formattedPrice,
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF1C69D4)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Color Variant Selection
        const Text(
          'Pilih Warna Kendaraan',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: (widget.motor.colors.isNotEmpty ? widget.motor.colors : const ['Hitam', 'Putih', 'Merah']).map((color) {
            final isSelected = selectedColor == color;
            return AppSelectionChip(
              label: color,
              isSelected: isSelected,
              onTap: () => setState(() => _selectedColor = color),
            );
          }).toList(),
        ),
        const SizedBox(height: 20),

        // Dealer Branch Selection
        const Text(
          'Cabang Dealer SRB Motor',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFCBD5E1)),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<Branch>(
              isExpanded: true,
              value: branches.any((b) => b.code == selectedBranch.code)
                  ? branches.firstWhere((b) => b.code == selectedBranch.code)
                  : branches.first,
              items: branches.map((b) {
                return DropdownMenuItem<Branch>(
                  value: b,
                  child: Row(
                    children: [
                      const Icon(Icons.storefront_rounded, size: 18, color: AppColors.primary),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          b.name,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF0F172A)),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (b.isMainBranch) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F172A),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'PUSAT',
                            style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: Colors.white),
                          ),
                        ),
                      ],
                    ],
                  ),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedBranch = val);
              },
            ),
          ),
        ),
        const SizedBox(height: 20),

        // Delivery Method
        const Text(
          'Metode Pengiriman',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        const SizedBox(height: 8),
        _buildOptionRadio(
          title: 'Kirim ke Alamat Rumah',
          subtitle: 'Unit diantar langsung dengan towing resmi SRB Motor',
          value: 'Kirim ke Alamat Rumah',
          groupValue: _deliveryMethod,
          onChanged: (v) => setState(() => _deliveryMethod = v!),
        ),
        const SizedBox(height: 8),
        _buildOptionRadio(
          title: 'Ambil Sendiri di Cabang Dealer',
          subtitle: 'Ambil langsung di cabang terpilih setelah proses selesai',
          value: 'Ambil di Dealer',
          groupValue: _deliveryMethod,
          onChanged: (v) => setState(() => _deliveryMethod = v!),
        ),
      ],
    );
  }

  // STEP 2: Personal Information
  Widget _buildStepPersonalInfo() {
    return Form(
      key: _formKeyPersonal,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Data Pribadi Pemesan',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 12),
          _buildTextField(
            label: 'Nama Lengkap (Sesuai KTP) *',
            controller: _nameController,
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Nama lengkap wajib diisi' : null,
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildTextField(
                  label: 'No. WhatsApp *',
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  validator: (v) => (v == null || v.trim().length < 9) ? 'No HP minimal 9 digit' : null,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildTextField(
                  label: 'Email Aktif *',
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) => (v == null || !v.contains('@')) ? 'Email tidak valid' : null,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildTextField(
            label: 'Nomor Induk Kependudukan (NIK) *',
            controller: _nikController,
            keyboardType: TextInputType.number,
            maxLength: 16,
            validator: (v) => (v == null || v.trim().length != 16) ? 'NIK harus 16 digit angka' : null,
          ),
          const SizedBox(height: 12),
          _buildTextField(
            label: 'Alamat Lengkap Pengiriman / Domisili *',
            controller: _addressController,
            maxLines: 2,
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Alamat wajib diisi' : null,
          ),

          if (widget.isCredit) ...[
            const SizedBox(height: 20),
            const Text(
              'Informasi Pekerjaan & Finansial',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 12),
            _buildTextField(
              label: 'Pekerjaan Saat Ini *',
              controller: _occupationController,
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Pekerjaan wajib diisi' : null,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildTextField(
                    label: 'Penghasilan / Bulan (Rp) *',
                    controller: _incomeController,
                    keyboardType: TextInputType.number,
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Wajib diisi' : null,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildTextField(
                    label: 'Lama Bekerja *',
                    controller: _employmentDurationController,
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Wajib diisi' : null,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  // STEP 3: Financing Simulation (Credit Only)
  Widget _buildStepFinancing() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Live Installment Highlight Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF131D31), Color(0xFF1C69D4)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(18),
            boxShadow: const [
              BoxShadow(color: Color(0x221C69D4), blurRadius: 16, offset: Offset(0, 6)),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'ESTIMASI ANGSURAN BULANAN',
                    style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.5),
                  ),
                  Icon(Icons.calculate_outlined, color: Colors.white, size: 20),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                _formatRupiah(_monthlyInstallment),
                style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 4),
              Text(
                'Per bulan selama $selectedTenor Bulan (Bunga Flat 1.5%)',
                style: const TextStyle(color: Colors.white70, fontSize: 12),
              ),
              const Divider(color: Colors.white24, height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Uang Muka (DP): ${_formatRupiah(dpAmount)}',
                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                  Text(
                    'Pokok: ${_formatRupiah(_loanAmount)}',
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // DP Slider
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Atur Uang Muka (DP)',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            Text(
              _formatRupiah(dpAmount),
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.primary),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Slider(
          value: dpAmount,
          min: _minDp,
          max: (widget.motor.price * 0.8).clamp(_minDp, widget.motor.price),
          divisions: 20,
          activeColor: AppColors.primary,
          inactiveColor: const Color(0xFFE2E8F0),
          onChanged: (val) => setState(() => _dpAmount = val),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Min: ${_formatRupiah(_minDp)}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              Text('Maks: ${_formatRupiah(widget.motor.price * 0.8)}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Tenor Options
        const Text(
          'Pilih Jangka Waktu (Tenor)',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: tenorOptions.map((t) {
            final isSelected = selectedTenor == t;
            return Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _selectedTenor = t),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.primary : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isSelected ? AppColors.primary : const Color(0xFFCBD5E1),
                      width: isSelected ? 1.5 : 1,
                    ),
                  ),
                  child: Column(
                    children: [
                      Text(
                        '$t',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          color: isSelected ? Colors.white : const Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Bulan',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                          color: isSelected ? Colors.white70 : const Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  // STEP 4 (or 3 for cash): Documents, Payment & Summary
  Widget _buildStepSummaryAndPayment() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Cash Payment Type Toggle
        if (!widget.isCredit) ...[
          const Text(
            'Skema Pembayaran Tunai',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 8),
          _buildOptionRadio(
            title: 'Pembayaran Lunas Penuh',
            subtitle: 'Lunasi total ${_formatRupiah(widget.motor.price)} secara langsung',
            value: false,
            groupValue: _isBookingFee,
            onChanged: (v) => setState(() => _isBookingFee = v!),
          ),
          const SizedBox(height: 8),
          _buildOptionRadio(
            title: 'Booking Fee (Tanda Jadi)',
            subtitle: 'Kunci unit dengan DP awal ${_formatRupiah(_bookingFeeAmount)}, sisa dibayar saat unit tiba',
            value: true,
            groupValue: _isBookingFee,
            onChanged: (v) => setState(() => _isBookingFee = v!),
          ),
          const SizedBox(height: 20),
        ],

        // Channel Payment Method
        const Text(
          'Metode Pembayaran',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        const SizedBox(height: 8),
        _buildOptionRadio(
          title: 'Transfer Bank / Midtrans (Online)',
          subtitle: 'Virtual Account BCA/Mandiri/BRI, QRIS, GoPay, ShopeePay',
          value: 'Transfer Bank',
          groupValue: _paymentMethod,
          onChanged: (v) => setState(() => _paymentMethod = v!),
        ),
        const SizedBox(height: 8),
        _buildOptionRadio(
          title: widget.isCredit ? 'Bayar DP di Dealer / Saat Disurvei' : 'Tunai / COD di Dealer',
          subtitle: 'Pembayaran tunai saat penyerahan berkas atau unit',
          value: 'Tunai',
          groupValue: _paymentMethod,
          onChanged: (v) => setState(() => _paymentMethod = v!),
        ),
        const SizedBox(height: 24),

        // Document Upload Section (KTP & KK)
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Unggah Dokumen Pendukung',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            Text(
              'Format Foto / JPG',
              style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _buildDocUploadCard(
                title: 'Foto e-KTP',
                subtitle: widget.isCredit ? 'Wajib untuk kredit' : 'Opsional',
                file: _ktpFile,
                onTap: () => _pickDocument(isKtp: true),
                onDelete: () => setState(() => _ktpFile = null),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildDocUploadCard(
                title: 'Foto Kartu Keluarga',
                subtitle: widget.isCredit ? 'Wajib untuk kredit' : 'Opsional',
                file: _kkFile,
                onTap: () => _pickDocument(isKtp: false),
                onDelete: () => setState(() => _kkFile = null),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),

        // Cost Breakdown Summary Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Rincian Pemesanan',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 12),
              _buildSummaryRow('Unit Motor', widget.motor.name),
              _buildSummaryRow('Warna Terpilih', selectedColor),
              _buildSummaryRow('Cabang Pengambilan', selectedBranch.name),
              _buildSummaryRow('Harga OTR Unit', widget.motor.formattedPrice),
              if (widget.isCredit) ...[
                _buildSummaryRow('Uang Muka (DP)', _formatRupiah(dpAmount)),
                _buildSummaryRow('Jangka Waktu (Tenor)', '$selectedTenor Bulan'),
                _buildSummaryRow('Cicilan / Bulan', _formatRupiah(_monthlyInstallment), isHighlight: true),
              ] else ...[
                if (_isBookingFee) ...[
                  _buildSummaryRow('Booking Fee', _formatRupiah(_bookingFeeAmount), isHighlight: true),
                  _buildSummaryRow('Sisa Pelunasan', _formatRupiah(widget.motor.price - _bookingFeeAmount)),
                ] else ...[
                  _buildSummaryRow('Total Pembayaran', _formatRupiah(widget.motor.price), isHighlight: true),
                ],
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Terms Agreement
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 24,
              height: 24,
              child: Checkbox(
                value: _agreeTerms,
                activeColor: AppColors.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                onChanged: (val) => setState(() => _agreeTerms = val ?? false),
              ),
            ),
            const SizedBox(width: 8),
            const Expanded(
              child: Text(
                'Saya menyetujui bahwa data yang diisi adalah benar dan bersedia dihubungi oleh pihak SRB Motor untuk proses verifikasi dan serah terima unit.',
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.4),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDocUploadCard({
    required String title,
    required String subtitle,
    required XFile? file,
    required VoidCallback onTap,
    required VoidCallback onDelete,
  }) {
    final hasFile = file != null;

    return Container(
      height: 130,
      decoration: BoxDecoration(
        color: hasFile ? const Color(0xFFEFF6FF) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: hasFile ? AppColors.primary : const Color(0xFFCBD5E1),
          width: hasFile ? 1.5 : 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: hasFile
                ? Stack(
                    children: [
                      Center(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.file(
                            File(file.path),
                            fit: BoxFit.cover,
                            width: double.infinity,
                            height: double.infinity,
                          ),
                        ),
                      ),
                      Positioned(
                        top: 2,
                        right: 2,
                        child: GestureDetector(
                          onTap: onDelete,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Colors.black54,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.close, size: 14, color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  )
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.cloud_upload_outlined, size: 28, color: AppColors.primary),
                      const SizedBox(height: 6),
                      Text(
                        title,
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isHighlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          Text(
            value,
            style: TextStyle(
              fontSize: 13,
              fontWeight: isHighlight ? FontWeight.w900 : FontWeight.w600,
              color: isHighlight ? const Color(0xFF1C69D4) : const Color(0xFF0F172A),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    String? Function(String?)? validator,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    int? maxLength,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          validator: validator,
          keyboardType: keyboardType,
          maxLines: maxLines,
          maxLength: maxLength,
          style: const TextStyle(fontSize: 13, color: Color(0xFF0F172A)),
          decoration: InputDecoration(
            counterText: '',
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildOptionRadio<T>({
    required String title,
    required String subtitle,
    required T value,
    required T groupValue,
    required ValueChanged<T?> onChanged,
  }) {
    final isSelected = value == groupValue;
    return GestureDetector(
      onTap: () => onChanged(value),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFEFF6FF) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppColors.primary : const Color(0xFFCBD5E1),
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? AppColors.primary : const Color(0xFF94A3B8),
                  width: 2,
                ),
              ),
              child: isSelected
                  ? Center(
                      child: Container(
                        width: 10,
                        height: 10,
                        decoration: const BoxDecoration(
                          color: AppColors.primary,
                          shape: BoxShape.circle,
                        ),
                      ),
                    )
                  : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Bottom Fixed Action Bar
  Widget _buildBottomActionBar() {
    final isLastStep = _currentStep == _totalSteps - 1;
    final submitLabel = widget.isCredit
        ? 'Ajukan Pembiayaan Kredit'
        : (_paymentMethod == 'Transfer Bank' ? 'Bayar Sekarang (Midtrans)' : 'Konfirmasi Pesanan');

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
      ),
      child: Row(
        children: [
          if (_currentStep > 0) ...[
            OutlinedButton(
              onPressed: _isSubmitting ? null : _onPrevStep,
              style: OutlinedButton.styleFrom(
                foregroundColor: const Color(0xFF475569),
                side: const BorderSide(color: Color(0xFFCBD5E1)),
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('Kembali', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            child: ElevatedButton(
              onPressed: _isSubmitting ? null : _onNextStep,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _isSubmitting
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : Text(
                      isLastStep ? submitLabel : 'Lanjutkan',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
