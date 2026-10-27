import 'package:flutter/material.dart';
import 'package:srb_motor_app/app_state.dart';
import 'package:srb_motor_app/models/motor.dart';
import 'package:srb_motor_app/screens/detail/motor_compare_screen.dart';
import 'package:srb_motor_app/widgets/motor_image_view.dart';

class MotorDetailScreen extends StatefulWidget {
  final Motor motor;
  final AppState appState;
  final String Function(double price)? formatPrice;

  const MotorDetailScreen({
    super.key,
    required this.motor,
    required this.appState,
    this.formatPrice,
  });

  @override
  State<MotorDetailScreen> createState() => _MotorDetailScreenState();
}

class _MotorDetailScreenState extends State<MotorDetailScreen> {
  double dpPercent = 20.0; // Default to 20% DP as in the web version
  int selectedTenor = 36; // Default to 36 months tenor as in the web version
  final List<int> tenors = const [12, 24, 36]; // Tenors: 12, 24, 36 months

  double get monthlyInstallment {
    final dpAmount = widget.motor.price * (dpPercent / 100);
    final principal = widget.motor.price - dpAmount;
    if (principal <= 0) return 0;
    const interestRate = 0.015; // 1.5% flat interest per month
    final totalInterest = principal * interestRate * selectedTenor;
    return (principal + totalInterest) / selectedTenor;
  }

  String formatFullCurrency(double amount) {
    final buffer = StringBuffer('Rp ');
    final str = amount.toInt().toString();
    int len = str.length;
    for (int i = 0; i < len; i++) {
      buffer.write(str[i]);
      if ((len - i - 1) % 3 == 0 && i != len - 1) {
        buffer.write('.');
      }
    }
    return buffer.toString();
  }

  /// Clean HTML markup from backend rich-text description into elegant formatted text
  String _cleanHtml(String html) {
    if (html.isEmpty) return 'Tidak ada deskripsi.';
    var text = html
        .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'</?(h[1-6]|p|div)[^>]*>', caseSensitive: false), '\n\n')
        .replaceAll(RegExp(r'<li[^>]*>', caseSensitive: false), '\n• ')
        .replaceAll(RegExp(r'</li>', caseSensitive: false), '')
        .replaceAll(RegExp(r'</?(ul|ol)[^>]*>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'<[^>]*>'), '')
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', "'")
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>');
    return text.replaceAll(RegExp(r'\n{3,}'), '\n\n').trim();
  }

  void _showCompareSelection(BuildContext context) {
    final otherMotors = widget.appState.motors.where((m) => m.id != widget.motor.id).toList();

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Pilih Motor Pembanding',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF041627),
                ),
              ),
              const SizedBox(height: 12),
              Expanded(
                child: ListView.separated(
                  itemCount: otherMotors.length,
                  separatorBuilder: (context, index) => const Divider(),
                  itemBuilder: (context, index) {
                    final other = otherMotors[index];
                    return ListTile(
                      leading: SizedBox(
                        width: 50,
                        child: MotorImageView(
                          imageUrl: other.displayImageUrl,
                          assetPath: other.imagePath,
                          width: 50,
                          height: 40,
                          fit: BoxFit.contain,
                        ),
                      ),
                      title: Text(
                        other.name,
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF041627)),
                      ),
                      subtitle: Text('${other.brand} • ${widget.formatPrice != null ? widget.formatPrice!(other.price) : other.formattedPrice}'),
                      onTap: () {
                        Navigator.pop(context); // Close bottom sheet
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MotorCompareScreen(
                              motor1: widget.motor,
                              motor2: other,
                              formatPrice: widget.formatPrice ?? (p) => formatFullCurrency(p),
                            ),
                          ),
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showAuthRequiredSheet(BuildContext context, String actionText) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: const BoxDecoration(
                color: Color(0xFFEFF6FF),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.lock_outline_rounded, color: Color(0xFF1C69D4), size: 32),
            ),
            const SizedBox(height: 16),
            const Text(
              'Sesi Diperlukan',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 8),
            Text(
              'Silakan masuk ke akun SRB Motor Anda terlebih dahulu untuk $actionText.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  Navigator.of(context).pushNamed('/login');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1C69D4),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 0,
                ),
                child: const Text('Masuk ke Akun', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
              ),
            ),
            const SizedBox(height: 10),
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Batal', style: TextStyle(color: Color(0xFF64748B))),
            ),
          ],
        ),
      ),
    );
  }

  void _showOrderSuccessDialog(BuildContext context, String title, String refNumber, String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        contentPadding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Color(0xFFECFDF5),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle_rounded, color: Color(0xFF059669), size: 40),
            ),
            const SizedBox(height: 16),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'No. Order: $refNumber',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF1C69D4)),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B), height: 1.4),
            ),
          ],
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            height: 46,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                Navigator.pop(context); // Close detail and return to dashboard
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1C69D4),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              child: const Text('Lihat di Menu Transaksi', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
            ),
          ),
        ],
      ),
    );
  }

  void _openCashOrderSheet(BuildContext context) {
    if (!widget.appState.isAuthenticated) {
      _showAuthRequiredSheet(context, 'melakukan pemesanan tunai');
      return;
    }

    final user = widget.appState.currentUser;
    final nameController = TextEditingController(text: user?.name ?? '');
    final phoneController = TextEditingController(text: (user?.phone != null && user?.phone != '-') ? user!.phone : '');
    final nikController = TextEditingController(text: user?.nik ?? '');
    final addressController = TextEditingController(text: user?.address ?? '');
    String selectedColor = widget.motor.colors.isNotEmpty ? widget.motor.colors.first : 'Default';
    String deliveryMethod = 'Kirim ke Alamat Rumah';
    String paymentMethod = 'Transfer Bank';
    bool isSubmitting = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.88,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                children: [
                  // Drag Handle
                  Container(
                    margin: const EdgeInsets.only(top: 12, bottom: 8),
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFCBD5E1),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),

                  // Header
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Pemesanan Tunai (Cash)',
                          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, size: 20, color: Color(0xFF64748B)),
                          onPressed: () => Navigator.pop(sheetContext),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1, color: Color(0xFFE2E8F0)),

                  // Form Fields
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.all(20),
                      children: [
                        // Motor Summary Card
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(10),
                                child: Container(
                                  width: 60,
                                  height: 52,
                                  color: Colors.white,
                                  child: MotorImageView(
                                    imageUrl: widget.motor.displayImageUrl,
                                    assetPath: widget.motor.imagePath,
                                    width: 60,
                                    height: 52,
                                    fit: BoxFit.contain,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      widget.motor.name,
                                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF0F172A)),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 3),
                                    Text(
                                      widget.motor.formattedPrice,
                                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: Color(0xFF1C69D4)),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 18),

                        // Pilihan Warna
                        if (widget.motor.colors.isNotEmpty) ...[
                          const Text('Pilih Warna Unit', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF475569))),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            children: widget.motor.colors.map((c) {
                              final isSel = selectedColor == c;
                              return ChoiceChip(
                                label: Text(c),
                                selected: isSel,
                                checkmarkColor: Colors.white,
                                selectedColor: const Color(0xFF1C69D4),
                                backgroundColor: const Color(0xFFF1F5F9),
                                labelStyle: TextStyle(
                                  color: isSel ? Colors.white : const Color(0xFF334155),
                                  fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
                                  fontSize: 12,
                                ),
                                onSelected: (_) => setSheetState(() => selectedColor = c),
                              );
                            }).toList(),
                          ),
                          const SizedBox(height: 16),
                        ],

                        // Data Pembeli
                        const Text('Data Pemesan', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF475569))),
                        const SizedBox(height: 8),
                        _buildFormField(label: 'Nama Lengkap (sesuai KTP)', controller: nameController, icon: Icons.person_outline),
                        const SizedBox(height: 10),
                        _buildFormField(label: 'Nomor NIK KTP', controller: nikController, icon: Icons.badge_outlined, keyboardType: TextInputType.number),
                        const SizedBox(height: 10),
                        _buildFormField(label: 'Nomor WhatsApp / Telepon', controller: phoneController, icon: Icons.phone_outlined, keyboardType: TextInputType.phone),
                        const SizedBox(height: 10),
                        _buildFormField(label: 'Alamat Pengiriman', controller: addressController, icon: Icons.location_on_outlined, maxLines: 2),
                        const SizedBox(height: 16),

                        // Metode Pengiriman
                        const Text('Metode Pengiriman', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF475569))),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: _buildSelectCard(
                                title: 'Kirim ke Rumah',
                                isSelected: deliveryMethod == 'Kirim ke Alamat Rumah',
                                icon: Icons.local_shipping_outlined,
                                onTap: () => setSheetState(() => deliveryMethod = 'Kirim ke Alamat Rumah'),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _buildSelectCard(
                                title: 'Ambil di Dealer',
                                isSelected: deliveryMethod == 'Ambil di Dealer',
                                icon: Icons.storefront_outlined,
                                onTap: () => setSheetState(() => deliveryMethod = 'Ambil di Dealer'),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Metode Pembayaran
                        const Text('Metode Pembayaran', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF475569))),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: _buildSelectCard(
                                title: 'Transfer Bank',
                                isSelected: paymentMethod == 'Transfer Bank',
                                icon: Icons.account_balance_outlined,
                                onTap: () => setSheetState(() => paymentMethod = 'Transfer Bank'),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _buildSelectCard(
                                title: 'Tunai saat Terima',
                                isSelected: paymentMethod == 'Tunai saat Serah Terima',
                                icon: Icons.payments_outlined,
                                onTap: () => setSheetState(() => paymentMethod = 'Tunai saat Serah Terima'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Sticky Submit Button
                  Container(
                    padding: EdgeInsets.fromLTRB(20, 12, 20, MediaQuery.of(context).padding.bottom + 12),
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
                    ),
                    child: SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: isSubmitting
                            ? null
                            : () async {
                                if (nameController.text.trim().isEmpty ||
                                    phoneController.text.trim().isEmpty ||
                                    nikController.text.trim().isEmpty ||
                                    addressController.text.trim().isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Harap lengkapi semua data formulir pemesanan.')),
                                  );
                                  return;
                                }

                                setSheetState(() => isSubmitting = true);
                                final payload = {
                                  'motor_id': widget.motor.id,
                                  'customer_name': nameController.text.trim(),
                                  'customer_phone': phoneController.text.trim(),
                                  'customer_email': user?.email ?? '',
                                  'customer_nik': nikController.text.trim(),
                                  'customer_address': addressController.text.trim(),
                                  'motor_color': selectedColor,
                                  'delivery_method': deliveryMethod,
                                  'payment_method': paymentMethod,
                                  'booking_fee': 0,
                                  'branch': widget.motor.branch.isNotEmpty ? widget.motor.branch : 'Pusat',
                                };

                                final messenger = ScaffoldMessenger.of(context);
                                final navigator = Navigator.of(sheetContext);
                                final res = await widget.appState.submitCashOrder(payload);
                                if (sheetContext.mounted) {
                                  setSheetState(() => isSubmitting = false);
                                }

                                if (res['success'] == true) {
                                  navigator.pop();
                                  final data = res['data'];
                                  final ref = data != null ? (data['reference_number'] ?? data['order_id']?.toString() ?? 'ORD-${DateTime.now().millisecondsSinceEpoch}') : 'ORD-${DateTime.now().millisecondsSinceEpoch}';
                                  if (!context.mounted) return;
                                  _showOrderSuccessDialog(
                                    context,
                                    'Pesanan Tunai Berhasil!',
                                    ref.toString(),
                                    'Unit ${widget.motor.name} warna $selectedColor telah dipesan. Tim SRB Motor akan segera menghubungi Anda untuk konfirmasi jadwal serah terima.',
                                  );
                                } else {
                                  messenger.showSnackBar(
                                    SnackBar(content: Text(res['message'] ?? 'Gagal membuat pesanan.')),
                                  );
                                }
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1C69D4),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        child: isSubmitting
                            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : const Text('KIRIM PEMESANAN TUNAI', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 13, letterSpacing: 0.5)),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _openCreditOrderSheet(BuildContext context) {
    if (!widget.appState.isAuthenticated) {
      _showAuthRequiredSheet(context, 'mengajukan pembelian kredit');
      return;
    }

    final user = widget.appState.currentUser;
    final nameController = TextEditingController(text: user?.name ?? '');
    final phoneController = TextEditingController(text: (user?.phone != null && user?.phone != '-') ? user!.phone : '');
    final nikController = TextEditingController(text: user?.nik ?? '');
    final addressController = TextEditingController(text: user?.address ?? '');
    final occupationController = TextEditingController();
    final incomeController = TextEditingController();
    final durationController = TextEditingController(text: '1 Tahun');
    String selectedColor = widget.motor.colors.isNotEmpty ? widget.motor.colors.first : 'Default';
    final calcDpAmount = widget.motor.price * (dpPercent / 100);
    bool isSubmitting = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.90,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                children: [
                  // Drag Handle
                  Container(
                    margin: const EdgeInsets.only(top: 12, bottom: 8),
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFCBD5E1),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),

                  // Header
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Pengajuan Kredit Motor',
                          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, size: 20, color: Color(0xFF64748B)),
                          onPressed: () => Navigator.pop(sheetContext),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1, color: Color(0xFFE2E8F0)),

                  // Form Fields
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.all(20),
                      children: [
                        // Credit Details Highlight
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: const Color(0xFFBFDBFE)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(widget.motor.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF0F172A))),
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('Uang Muka (DP ${dpPercent.toInt()}%):', style: const TextStyle(fontSize: 12, color: Color(0xFF475569))),
                                  Text(formatFullCurrency(calcDpAmount), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F172A))),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('Tenor Pembiayaan:', style: const TextStyle(fontSize: 12, color: Color(0xFF475569))),
                                  Text('$selectedTenor Bulan', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F172A))),
                                ],
                              ),
                              const Divider(height: 16, color: Color(0xFFDBEAFE)),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text('Estimasi Angsuran:', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF1C69D4))),
                                  Text('${formatFullCurrency(monthlyInstallment)} / bln', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: Color(0xFF1C69D4))),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 18),

                        // Pilihan Warna
                        if (widget.motor.colors.isNotEmpty) ...[
                          const Text('Pilih Warna Unit', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF475569))),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            children: widget.motor.colors.map((c) {
                              final isSel = selectedColor == c;
                              return ChoiceChip(
                                label: Text(c),
                                selected: isSel,
                                checkmarkColor: Colors.white,
                                selectedColor: const Color(0xFF1C69D4),
                                backgroundColor: const Color(0xFFF1F5F9),
                                labelStyle: TextStyle(
                                  color: isSel ? Colors.white : const Color(0xFF334155),
                                  fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
                                  fontSize: 12,
                                ),
                                onSelected: (_) => setSheetState(() => selectedColor = c),
                              );
                            }).toList(),
                          ),
                          const SizedBox(height: 16),
                        ],

                        // Data Pemohon
                        const Text('Data Pemohon Kredit', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF475569))),
                        const SizedBox(height: 8),
                        _buildFormField(label: 'Nama Lengkap (sesuai KTP)', controller: nameController, icon: Icons.person_outline),
                        const SizedBox(height: 10),
                        _buildFormField(label: 'Nomor NIK KTP', controller: nikController, icon: Icons.badge_outlined, keyboardType: TextInputType.number),
                        const SizedBox(height: 10),
                        _buildFormField(label: 'Nomor WhatsApp / Telepon', controller: phoneController, icon: Icons.phone_outlined, keyboardType: TextInputType.phone),
                        const SizedBox(height: 10),
                        _buildFormField(label: 'Alamat Tinggal Sekarang', controller: addressController, icon: Icons.location_on_outlined, maxLines: 2),
                        const SizedBox(height: 16),

                        // Data Finansial & Pekerjaan
                        const Text('Data Pekerjaan & Finansial', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF475569))),
                        const SizedBox(height: 8),
                        _buildFormField(label: 'Profesi / Pekerjaan (cth: Karyawan, Wiraswasta)', controller: occupationController, icon: Icons.work_outline),
                        const SizedBox(height: 10),
                        _buildFormField(label: 'Pendapatan Bulanan (Rp)', controller: incomeController, icon: Icons.account_balance_wallet_outlined, keyboardType: TextInputType.number),
                        const SizedBox(height: 10),
                        _buildFormField(label: 'Lama Bekerja / Usaha (cth: 2 Tahun)', controller: durationController, icon: Icons.access_time_outlined),
                      ],
                    ),
                  ),

                  // Sticky Submit Button
                  Container(
                    padding: EdgeInsets.fromLTRB(20, 12, 20, MediaQuery.of(context).padding.bottom + 12),
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
                    ),
                    child: SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: isSubmitting
                            ? null
                            : () async {
                                if (nameController.text.trim().isEmpty ||
                                    phoneController.text.trim().isEmpty ||
                                    nikController.text.trim().isEmpty ||
                                    addressController.text.trim().isEmpty ||
                                    occupationController.text.trim().isEmpty ||
                                    incomeController.text.trim().isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Harap lengkapi semua data formulir pengajuan kredit.')),
                                  );
                                  return;
                                }

                                final income = double.tryParse(incomeController.text.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0;
                                if (income <= 0) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Nominal pendapatan bulanan tidak valid.')),
                                  );
                                  return;
                                }

                                setSheetState(() => isSubmitting = true);
                                final payload = {
                                  'motor_id': widget.motor.id,
                                  'customer_name': nameController.text.trim(),
                                  'customer_phone': phoneController.text.trim(),
                                  'customer_email': user?.email ?? '',
                                  'customer_nik': nikController.text.trim(),
                                  'customer_address': addressController.text.trim(),
                                  'motor_color': selectedColor,
                                  'delivery_method': 'Kirim ke Alamat Rumah',
                                  'payment_method': 'Transfer Bank',
                                  'occupation': occupationController.text.trim(),
                                  'monthly_income': income,
                                  'employment_duration': durationController.text.trim(),
                                  'dp_amount': calcDpAmount,
                                  'tenor': selectedTenor,
                                  'branch': widget.motor.branch.isNotEmpty ? widget.motor.branch : 'Pusat',
                                };

                                final messenger = ScaffoldMessenger.of(context);
                                final navigator = Navigator.of(sheetContext);
                                final res = await widget.appState.submitCreditOrder(payload);
                                if (sheetContext.mounted) {
                                  setSheetState(() => isSubmitting = false);
                                }

                                if (res['success'] == true) {
                                  navigator.pop();
                                  final data = res['data'];
                                  final ref = data != null ? (data['reference_number'] ?? data['order_id']?.toString() ?? 'CRD-${DateTime.now().millisecondsSinceEpoch}') : 'CRD-${DateTime.now().millisecondsSinceEpoch}';
                                  if (!context.mounted) return;
                                  _showOrderSuccessDialog(
                                    context,
                                    'Pengajuan Kredit Terkirim!',
                                    ref.toString(),
                                    'Pengajuan pembiayaan unit ${widget.motor.name} telah berhasil masuk ke antrean verifikasi survei. Tim surveyor SRB Motor akan segera menghubungi Anda.',
                                  );
                                } else {
                                  messenger.showSnackBar(
                                    SnackBar(content: Text(res['message'] ?? 'Gagal mengajukan kredit.')),
                                  );
                                }
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1C69D4),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        child: isSubmitting
                            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : const Text('KIRIM PENGAJUAN KREDIT', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 13, letterSpacing: 0.5)),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildFormField({
    required String label,
    required TextEditingController controller,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFCBD5E1)),
          ),
          child: TextField(
            controller: controller,
            keyboardType: keyboardType,
            maxLines: maxLines,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF0F172A)),
            decoration: InputDecoration(
              prefixIcon: Icon(icon, size: 18, color: const Color(0xFF64748B)),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSelectCard({
    required String title,
    required bool isSelected,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFEFF6FF) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? const Color(0xFF1C69D4) : const Color(0xFFE2E8F0),
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 16, color: isSelected ? const Color(0xFF1C69D4) : const Color(0xFF64748B)),
            const SizedBox(width: 6),
            Flexible(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                  color: isSelected ? const Color(0xFF1C69D4) : const Color(0xFF334155),
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isWishlisted = widget.appState.isInWishlist(widget.motor.id);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.motor.name),
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Image Presentation
          Container(
            height: 250,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withValues(alpha: 0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(18),
              child: Stack(
                children: [
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: MotorImageView(
                        imageUrl: widget.motor.displayImageUrl,
                        assetPath: widget.motor.imagePath,
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 14,
                    right: 14,
                    child: Material(
                      color: Colors.white,
                      shape: const CircleBorder(),
                      child: IconButton(
                        onPressed: () async {
                          await widget.appState.toggleWishlist(widget.motor.id);
                          setState(() {});
                        },
                        icon: Icon(
                          isWishlisted ? Icons.favorite : Icons.favorite_border,
                          color: isWishlisted ? Colors.red : Colors.grey,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Main Info Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.motor.name,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${widget.motor.brand} • ${widget.motor.type}',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[600],
                        ),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.formatPrice != null
                            ? widget.formatPrice!(widget.motor.price)
                            : widget.motor.formattedPrice,
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              color: const Color(0xFF1C69D4),
                              fontWeight: FontWeight.w800,
                            ),
                      ),
                      OutlinedButton.icon(
                        onPressed: () => _showCompareSelection(context),
                        icon: const Icon(Icons.compare_arrows, size: 18),
                        label: const Text(
                          'BANDINGKAN',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF1C69D4),
                          side: const BorderSide(color: Color(0xFF1C69D4)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  _detailTitle(context, 'Deskripsi'),
                  const SizedBox(height: 8),
                  Text(
                    _cleanHtml(widget.motor.description),
                    style: const TextStyle(fontSize: 13, height: 1.5, color: Color(0xFF334155)),
                  ),
                  const SizedBox(height: 18),
                  _detailTitle(context, 'Spesifikasi'),
                  const SizedBox(height: 12),
                  _specRow('Tahun', widget.motor.year.toString()),
                  _specRow('Transmisi', widget.motor.transmission),
                  _specRow('Mesin', '${widget.motor.engineCC} cc'),
                  _specRow('Berat', '${widget.motor.weight} kg'),
                  const SizedBox(height: 18),
                  _detailTitle(context, 'Warna Pilihan'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: widget.motor.colors
                        .map(
                          (color) => Chip(
                            label: Text(color),
                            backgroundColor: const Color(0xFFEFF6FF),
                          ),
                        )
                        .toList(),
                  ),
                  const SizedBox(height: 24),

                  // In-App Ordering Actions (Synchronized with Web)
                  if (widget.motor.isAvailable) ...[
                    // Beli Tunai Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton.icon(
                        onPressed: () => _openCashOrderSheet(context),
                        icon: const Icon(Icons.shopping_bag_outlined, color: Colors.white, size: 20),
                        label: const Text(
                          'PEMBELIAN TUNAI (CASH)',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                            fontSize: 13,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1C69D4),
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Pengajuan Kredit Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: OutlinedButton.icon(
                        onPressed: () => _openCreditOrderSheet(context),
                        icon: const Icon(Icons.credit_card_outlined, color: Color(0xFF0F172A), size: 20),
                        label: const Text(
                          'PENGAJUAN KREDIT',
                          style: TextStyle(
                            color: Color(0xFF0F172A),
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                            fontSize: 13,
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFFCBD5E1), width: 1.5),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                  ] else ...[
                    // Sold out banner
                    Container(
                      width: double.infinity,
                      height: 50,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFCBD5E1)),
                      ),
                      alignment: Alignment.center,
                      child: const Text(
                        'UNIT TERJUAL / STOK KOSONG',
                        style: TextStyle(
                          color: Color(0xFF94A3B8),
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.8,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 10),

                  // Hubungi Dealer via WhatsApp
                  SizedBox(
                    width: double.infinity,
                    height: 46,
                    child: TextButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Menghubungi dealer untuk unit ${widget.motor.name}...'),
                            backgroundColor: const Color(0xFF0F172A),
                          ),
                        );
                      },
                      icon: const Icon(Icons.chat_bubble_outline_rounded, color: Color(0xFF16A34A), size: 18),
                      label: const Text(
                        'TANYA VIA WHATSAPP',
                        style: TextStyle(
                          color: Color(0xFF16A34A),
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.5,
                          fontSize: 12.5,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Credit Simulation Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _detailTitle(context, 'Simulasi Kredit'),
                  const SizedBox(height: 6),
                  Text(
                    'Estimasi pembiayaan dengan bunga flat 1.5% per bulan.',
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                  const SizedBox(height: 20),
                  // DP Percentage Slider Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Uang Muka (DP): ${dpPercent.toInt()}%',
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                      ),
                      Text(
                        formatFullCurrency(widget.motor.price * (dpPercent / 100)),
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1C69D4),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: dpPercent,
                    min: 10.0,
                    max: 80.0,
                    divisions: 14,
                    label: '${dpPercent.toInt()}%',
                    activeColor: const Color(0xFF1C69D4),
                    inactiveColor: const Color(0xFFEFF6FF),
                    onChanged: (value) {
                      setState(() {
                        dpPercent = value;
                      });
                    },
                  ),
                  const SizedBox(height: 12),
                  // Tenor Selection
                  const Text(
                    'Pilih Tenor (Bulan)',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: tenors.map((tenor) {
                      final active = selectedTenor == tenor;
                      return ChoiceChip(
                        label: Text('$tenor Bulan'),
                        selected: active,
                        checkmarkColor: Colors.white, // High contrast white checkmark
                        onSelected: (selected) {
                          if (selected) {
                            setState(() {
                              selectedTenor = tenor;
                            });
                          }
                        },
                        selectedColor: const Color(0xFF1C69D4),
                        backgroundColor: const Color(0xFFF1F5F9),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                          side: BorderSide(
                            color: active ? const Color(0xFF1C69D4) : const Color(0xFFE2E8F0),
                          ),
                        ),
                        labelStyle: TextStyle(
                          color: active ? Colors.white : const Color(0xFF041627),
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),
                  // Monthly Installment Result Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'ESTIMASI ANGSURAN',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1C69D4),
                            letterSpacing: 1.0,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          formatFullCurrency(monthlyInstallment),
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF041627),
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          '/ bulan',
                          style: TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  if (widget.motor.isAvailable) ...[
                    const SizedBox(height: 14),
                    SizedBox(
                      width: double.infinity,
                      height: 46,
                      child: ElevatedButton.icon(
                        onPressed: () => _openCreditOrderSheet(context),
                        icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
                        label: Text(
                          'AJUKAN DENGAN TENOR $selectedTenor BULAN',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                            fontSize: 12,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1C69D4),
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _detailTitle(BuildContext context, String text) {
    return Text(
      text,
      style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w800,
          ),
    );
  }

  Widget _specRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[700])),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}
