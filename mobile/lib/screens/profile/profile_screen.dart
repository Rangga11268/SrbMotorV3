import 'package:flutter/material.dart';
import 'package:srb_motor_app/app_state.dart';
import 'package:srb_motor_app/models/motor.dart';
import 'package:srb_motor_app/screens/detail/motor_detail_screen.dart';
import 'package:srb_motor_app/screens/home/widgets/motor_card.dart';
import '../../widgets/app_button.dart';

class ProfileScreen extends StatefulWidget {
  final AppState appState;
  final Function(int) onTabChange;

  const ProfileScreen({
    super.key,
    required this.appState,
    required this.onTabChange,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  TextEditingController? _nameController;
  TextEditingController? _phoneController;
  bool _isSaving = false;
  bool _isRefreshing = false;

  TextEditingController get nameController {
    return _nameController ??= TextEditingController(
      text: widget.appState.currentUser?.name ?? '',
    );
  }

  TextEditingController get phoneController {
    final user = widget.appState.currentUser;
    final initialPhone = (user?.phone != null && user?.phone != '-') ? user!.phone : '';
    return _phoneController ??= TextEditingController(text: initialPhone);
  }

  @override
  void initState() {
    super.initState();
    // Warm up controllers
    nameController;
    phoneController;
  }

  @override
  void didUpdateWidget(ProfileScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.appState.currentUser != widget.appState.currentUser) {
      final user = widget.appState.currentUser;
      if (user != null) {
        if (nameController.text != user.name) {
          nameController.text = user.name;
        }
        final phoneText = (user.phone != '-') ? user.phone : '';
        if (phoneController.text != phoneText) {
          phoneController.text = phoneText;
        }
      }
    }
  }

  @override
  void dispose() {
    _nameController?.dispose();
    _phoneController?.dispose();
    super.dispose();
  }

  List<Motor> get savedMotors {
    return widget.appState.motors
        .where((motor) => widget.appState.isInWishlist(motor.id))
        .toList();
  }

  Future<void> _refreshData() async {
    if (_isRefreshing) return;
    setState(() => _isRefreshing = true);

    try {
      if (widget.appState.isAuthenticated) {
        await widget.appState.fetchOrders();
      }
      await widget.appState.fetchMotors();
    } catch (_) {}

    if (mounted) {
      setState(() => _isRefreshing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Data berhasil disinkronkan'),
          duration: Duration(seconds: 1),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _saveChanges() async {
    final name = nameController.text.trim();
    final phone = phoneController.text.trim();

    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Nama lengkap wajib diisi.'),
          backgroundColor: Color(0xFFBA1A1A),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() => _isSaving = true);

    final res = await widget.appState.updateProfile(
      name: name,
      phone: phone,
    );

    if (mounted) {
      setState(() => _isSaving = false);
      final isSuccess = res['success'] == true;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            res['message'] ??
                (isSuccess
                    ? 'Profil berhasil disimpan!'
                    : 'Gagal menyimpan profil.'),
          ),
          backgroundColor:
              isSuccess ? const Color(0xFF16A34A) : const Color(0xFFBA1A1A),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _handleLogout() async {
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFFFDAD6),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.logout, color: Color(0xFFBA1A1A), size: 20),
            ),
            const SizedBox(width: 12),
            const Text(
              'Konfirmasi Keluar',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: const Text(
          'Apakah Anda yakin ingin keluar dari akun Anda di perangkat ini?',
          style: TextStyle(fontSize: 13, color: Color(0xFF49454F)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Batal', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
          ),
          AppButton.danger(
            text: 'Ya, Keluar',
            size: AppButtonSize.small,
            onPressed: () => Navigator.of(ctx).pop(true),
          ),
        ],
      ),
    );

    if (shouldLogout == true && mounted) {
      final navigator = Navigator.of(context);
      await widget.appState.logout();
      navigator.pushReplacementNamed('/login');
    }
  }

  void _showCustomerServiceDialog() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.support_agent_rounded,
                    color: Color(0xFF16A34A),
                    size: 24,
                  ),
                ),
                const SizedBox(width: 14),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Layanan Pelanggan SRB Motor',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    Text(
                      'Siap melayani pertanyaan & bantuan kredit',
                      style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const CircleAvatar(
                backgroundColor: Color(0xFFE2E8F0),
                child: Icon(Icons.phone_rounded, color: Color(0xFF1C69D4), size: 20),
              ),
              title: const Text('Hotline WhatsApp', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('+62 821-2345-6789 (08:00 - 17:00 WIB)', style: TextStyle(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Nomor CS WhatsApp: +62 821-2345-6789'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const CircleAvatar(
                backgroundColor: Color(0xFFE2E8F0),
                child: Icon(Icons.mail_outline_rounded, color: Color(0xFF1C69D4), size: 20),
              ),
              title: const Text('Email Support', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              subtitle: const Text('support@srbmotor.id', style: TextStyle(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Email CS: support@srbmotor.id'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showAboutAppDialog() {
    showAboutDialog(
      context: context,
      applicationName: 'SRB Motor',
      applicationVersion: 'v1.0.0',
      applicationIcon: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: const Color(0xFF1C69D4),
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Icon(Icons.two_wheeler_rounded, color: Colors.white, size: 28),
      ),
      children: const [
        Text(
          'Aplikasi resmi dealer motor SRB Motor. Menyediakan pembelian motor cash & kredit terpercaya, simulasi angsuran, serta pelacakan pesanan real-time.',
          style: TextStyle(fontSize: 13, height: 1.4),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'Akun & Profil',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
        actions: [
          IconButton(
            icon: _isRefreshing
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.refresh_rounded, color: Color(0xFF0F172A)),
            tooltip: 'Sinkronkan Data',
            onPressed: _refreshData,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: ListenableBuilder(
        listenable: widget.appState,
        builder: (context, _) {
          final liveUser = widget.appState.currentUser;
          final liveIsAuth = widget.appState.isAuthenticated;

          return RefreshIndicator(
            onRefresh: _refreshData,
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
              children: [
                if (!liveIsAuth)
                  _buildGuestHeader()
                else ...[
                  _buildUserHeader(liveUser),
                  const SizedBox(height: 16),
                  _buildQuickStats(liveUser),
                  const SizedBox(height: 24),
                  _buildProfileEditCard(liveUser),
                ],
                const SizedBox(height: 24),
                _buildWishlistSection(),
                const SizedBox(height: 24),
                _buildHelpAndInfoSection(),
                if (liveIsAuth) ...[
                  const SizedBox(height: 24),
                  _buildLogoutButton(),
                ],
                const SizedBox(height: 60), // Extra space for bottom nav bar
              ],
            ),
          );
        },
      ),
    );
  }

  // Guest State Widget
  Widget _buildGuestHeader() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFBFDBFE), width: 1.5),
            ),
            child: const Icon(
              Icons.person_rounded,
              size: 34,
              color: Color(0xFF1C69D4),
            ),
          ),
          const SizedBox(height: 14),
          const Text(
            'Selamat Datang di SRB Motor',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Masuk untuk melacak status pesanan, simpan motor favorit, dan mengajukan kredit motor impian.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              color: Color(0xFF64748B),
              height: 1.4,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: AppButton.primary(
                  text: 'Masuk',
                  icon: Icons.login_rounded,
                  size: AppButtonSize.medium,
                  isFullWidth: true,
                  onPressed: () {
                    Navigator.pushNamed(context, '/login');
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton.outline(
                  text: 'Daftar',
                  icon: Icons.person_add_outlined,
                  size: AppButtonSize.medium,
                  isFullWidth: true,
                  onPressed: () {
                    Navigator.pushNamed(context, '/register');
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Authenticated User Header
  Widget _buildUserHeader(dynamic user) {
    final name = (user?.name != null && user.name.toString().isNotEmpty)
        ? user.name.toString()
        : 'Pelanggan SRB';
    final email = (user?.email != null && user.email.toString().isNotEmpty)
        ? user.email.toString()
        : 'user@srbmotor.id';
    final initial = name.isNotEmpty ? name[0].toUpperCase() : 'U';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(18),
      child: Row(
        children: [
          Container(
            width: 58,
            height: 58,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [Color(0xFF1C69D4), Color(0xFF0F172A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Center(
              child: Text(
                initial,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 6),
                    const Icon(
                      Icons.verified_rounded,
                      color: Color(0xFF1C69D4),
                      size: 18,
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  email,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.circle, color: Color(0xFF10B981), size: 8),
                      SizedBox(width: 5),
                      Text(
                        'Member Terverifikasi',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF059669),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Quick Stats Row
  Widget _buildQuickStats(dynamic user) {
    final orderCount = widget.appState.orders.length;
    final wishlistCount = savedMotors.length;

    return Row(
      children: [
        Expanded(
          child: _buildStatItem(
            icon: Icons.receipt_long_rounded,
            title: orderCount.toString(),
            label: 'Pesanan',
            color: const Color(0xFF1C69D4),
            onTap: () => widget.onTabChange(2),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatItem(
            icon: Icons.bookmark_rounded,
            title: wishlistCount.toString(),
            label: 'Wishlist',
            color: const Color(0xFFF59E0B),
            onTap: () {
              if (wishlistCount == 0) {
                widget.onTabChange(1); // open catalog
              }
            },
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatItem(
            icon: Icons.check_circle_rounded,
            title: 'Aktif',
            label: 'Akun',
            color: const Color(0xFF10B981),
            onTap: () {},
          ),
        ),
      ],
    );
  }

  Widget _buildStatItem({
    required IconData icon,
    required String title,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(height: 6),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 11,
                  color: Color(0xFF64748B),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Profile Edit Card
  Widget _buildProfileEditCard(dynamic user) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.badge_outlined,
                  color: Color(0xFF1C69D4),
                  size: 18,
                ),
              ),
              const SizedBox(width: 10),
              const Text(
                'INFORMASI PRIBADI',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.0,
                  color: Color(0xFF0F172A),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Nama Lengkap
          const Text(
            'Nama Lengkap',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: Color(0xFF475569),
            ),
          ),
          const SizedBox(height: 6),
          TextFormField(
            controller: nameController,
            decoration: InputDecoration(
              hintText: 'Nama lengkap Anda',
              prefixIcon: const Icon(Icons.person_outline_rounded, size: 20),
              fillColor: const Color(0xFFF8FAFC),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFF1C69D4), width: 1.5),
              ),
            ),
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 14),
          // Nomor WhatsApp / Telepon
          const Text(
            'Nomor WhatsApp / HP',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: Color(0xFF475569),
            ),
          ),
          const SizedBox(height: 6),
          TextFormField(
            controller: phoneController,
            keyboardType: TextInputType.phone,
            decoration: InputDecoration(
              hintText: 'Contoh: 08123456789',
              prefixIcon: const Icon(Icons.phone_outlined, size: 20),
              fillColor: const Color(0xFFF8FAFC),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFF1C69D4), width: 1.5),
              ),
            ),
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 14),
          // Alamat Email (Read-only)
          const Text(
            'Alamat Email',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: Color(0xFF475569),
            ),
          ),
          const SizedBox(height: 6),
          TextFormField(
            initialValue: user?.email ?? '',
            enabled: false,
            decoration: InputDecoration(
              prefixIcon: const Icon(Icons.mail_outline_rounded, size: 20),
              suffixIcon: const Icon(Icons.lock_outline_rounded, size: 18, color: Color(0xFF94A3B8)),
              fillColor: const Color(0xFFF1F5F9),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              disabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              helperText: 'Email digunakan untuk masuk dan tidak dapat diubah.',
              helperStyle: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
            ),
            style: const TextStyle(fontSize: 14, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 18),
          // Tombol Simpan
          AppButton.primary(
            text: 'Simpan Perubahan',
            icon: Icons.save_rounded,
            isFullWidth: true,
            isLoading: _isSaving,
            onPressed: _saveChanges,
          ),
        ],
      ),
    );
  }

  // Wishlist Section
  Widget _buildWishlistSection() {
    final motors = savedMotors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                const Text(
                  'MOTOR TERSIMPAN',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.0,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    motors.length.toString(),
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF475569),
                    ),
                  ),
                ),
              ],
            ),
            if (motors.isNotEmpty)
              TextButton(
                onPressed: () => widget.onTabChange(1), // Catalog
                style: TextButton.styleFrom(
                  visualDensity: VisualDensity.compact,
                  foregroundColor: const Color(0xFF1C69D4),
                ),
                child: const Text('Lihat Katalog', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
              ),
          ],
        ),
        const SizedBox(height: 12),
        if (motors.isEmpty)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Center(
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: const BoxDecoration(
                      color: Color(0xFFF8FAFC),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.bookmark_outline_rounded,
                      size: 28,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Belum ada motor yang disimpan',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Tandai motor impian Anda di katalog untuk menyimpannya di sini.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 14),
                  OutlinedButton.icon(
                    onPressed: () => widget.onTabChange(1),
                    icon: const Icon(Icons.explore_outlined, size: 16),
                    label: const Text('JELAJAHI KATALOG'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF1C69D4),
                      side: const BorderSide(color: Color(0xFF1C69D4)),
                      textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          )
        else
          Column(
            children: motors.map((motor) {
              return MotorCard(
                motor: motor,
                isWishlisted: true,
                onWishlistToggle: () async {
                  await widget.appState.toggleWishlist(motor.id);
                  if (mounted) setState(() {});
                },
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => MotorDetailScreen(
                        motor: motor,
                        appState: widget.appState,
                      ),
                    ),
                  );
                },
              );
            }).toList(),
          ),
      ],
    );
  }

  // Help & Info Section
  Widget _buildHelpAndInfoSection() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          _buildMenuTile(
            icon: Icons.receipt_long_outlined,
            title: 'Riwayat Pesanan & Transaksi',
            subtitle: 'Lihat status pengajuan kredit dan pembelian motor',
            onTap: () => widget.onTabChange(2),
          ),
          const Divider(height: 1, indent: 56, color: Color(0xFFF1F5F9)),
          _buildMenuTile(
            icon: Icons.support_agent_rounded,
            title: 'Layanan Pelanggan WhatsApp',
            subtitle: 'Konsultasi motor dan panduan angsuran',
            onTap: _showCustomerServiceDialog,
          ),
          const Divider(height: 1, indent: 56, color: Color(0xFFF1F5F9)),
          _buildMenuTile(
            icon: Icons.info_outline_rounded,
            title: 'Tentang Aplikasi SRB Motor',
            subtitle: 'Versi 1.0.0 (Official Dealer)',
            onTap: _showAboutAppDialog,
          ),
        ],
      ),
    );
  }

  Widget _buildMenuTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: const Color(0xFF1C69D4), size: 20),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w700,
          color: Color(0xFF0F172A),
        ),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
      ),
      trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
      onTap: onTap,
    );
  }

  // Logout Button
  Widget _buildLogoutButton() {
    return AppButton.danger(
      text: 'Keluar dari Akun',
      icon: Icons.logout_rounded,
      isFullWidth: true,
      onPressed: _handleLogout,
    );
  }
}
