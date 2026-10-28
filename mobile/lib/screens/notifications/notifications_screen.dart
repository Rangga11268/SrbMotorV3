import 'package:flutter/material.dart';
import '../../app_state.dart';
import '../../core/constants.dart';
import '../../models/order.dart';
import '../../services/api_service.dart';

class NotificationItem {
  final String id;
  final String title;
  final String message;
  final String time;
  final IconData icon;
  final Color iconColor;
  final Color iconBg;
  final String category; // 'order', 'survey', 'promo'
  final bool isUrgent;
  bool isRead;
  final int? orderId;

  NotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.time,
    required this.icon,
    required this.iconColor,
    required this.iconBg,
    required this.category,
    this.isUrgent = false,
    this.isRead = false,
    this.orderId,
  });
}

class NotificationsScreen extends StatefulWidget {
  final AppState appState;
  final Function(int)? onNavigateToTab;

  const NotificationsScreen({
    super.key,
    required this.appState,
    this.onNavigateToTab,
  });

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _isLoading = true;
  String _selectedCategory = 'all'; // all, order, promo
  List<NotificationItem> _notifications = [];

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() => _isLoading = true);
    final List<NotificationItem> items = [];

    // 1. Fetch real order status updates if user logged in
    if (widget.appState.isLoggedIn && widget.appState.token != null) {
      final res = await ApiService.getUserOrders(widget.appState.token!);
      if (res.isSuccess && res.data != null) {
        for (var raw in res.data!) {
          try {
            final order = Order.fromJson(raw as Map<String, dynamic>);
            
            // Check overdue survey
            if (order.isCredit && order.isSurveyOverdue && !order.isSurveyConfirmed) {
              items.add(
                NotificationItem(
                  id: 'overdue_survey_${order.id}',
                  title: 'Konfirmasi Jadwal Survei',
                  message: 'Jadwal survei unit ${order.motorName} telah terlewat. Mohon konfirmasi apakah Anda telah disurvei.',
                  time: 'Perlu Tindakan',
                  icon: Icons.assignment_late_rounded,
                  iconColor: const Color(0xFFD97706),
                  iconBg: const Color(0xFFFEF3C7),
                  category: 'order',
                  isUrgent: true,
                  orderId: order.id,
                ),
              );
            }

            // Normal order notification
            items.add(
              NotificationItem(
                id: 'order_${order.id}',
                title: 'Pesanan #${order.referenceNumber}',
                message: 'Status pesanan ${order.motorName} saat ini: ${order.statusLabel}.',
                time: order.createdAtFormatted,
                icon: order.isCredit ? Icons.account_balance_rounded : Icons.two_wheeler_rounded,
                iconColor: const Color(0xFF1C69D4),
                iconBg: const Color(0xFFEFF6FF),
                category: 'order',
                isUrgent: false,
                orderId: order.id,
              ),
            );
          } catch (_) {}
        }
      }
    }

    // 2. Default helpful announcements & tips
    items.add(
      NotificationItem(
        id: 'tip_survey',
        title: 'Tips Lolos Survei Kredit Motor',
        message: 'Pastikan KTP & KK terbaca jelas dan nomor kontak darurat dapat dihubungi saat surveyor datang.',
        time: 'Info SRB Motor',
        icon: Icons.tips_and_updates_rounded,
        iconColor: const Color(0xFF059669),
        iconBg: const Color(0xFFD1FAE5),
        category: 'promo',
      ),
    );

    items.add(
      NotificationItem(
        id: 'promo_dp',
        title: 'Promo Spesial DP Ringan 0%',
        message: 'Dapatkan kemudahan pembiayaan motor impian dengan bunga flat 1.5% dan angsuran terjangkau.',
        time: 'Promo Terkini',
        icon: Icons.local_offer_rounded,
        iconColor: const Color(0xFF7C3AED),
        iconBg: const Color(0xFFEDE9FE),
        category: 'promo',
      ),
    );

    if (mounted) {
      setState(() {
        _notifications = items;
        _isLoading = false;
      });
    }
  }

  void _markAllAsRead() {
    setState(() {
      for (var item in _notifications) {
        item.isRead = true;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Semua notifikasi ditandai sudah dibaca'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _notifications.where((item) {
      if (_selectedCategory == 'order') return item.category == 'order';
      if (_selectedCategory == 'promo') return item.category == 'promo';
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Pusat Notifikasi',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Color(0xFF0F172A),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          if (_notifications.isNotEmpty)
            TextButton(
              onPressed: _markAllAsRead,
              child: const Text(
                'Tandai Dibaca',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
            ),
        ],
      ),
      body: Column(
        children: [
          // Filter Tabs
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              children: [
                _buildFilterChip('Semua', 'all'),
                const SizedBox(width: 8),
                _buildFilterChip('Transaksi', 'order'),
                const SizedBox(width: 8),
                _buildFilterChip('Promo & Info', 'promo'),
              ],
            ),
          ),
          const Divider(height: 1, color: Color(0xFFE2E8F0)),

          // List
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: AppColors.primary),
                  )
                : filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(20),
                              decoration: const BoxDecoration(
                                color: Color(0xFFF1F5F9),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.notifications_off_outlined,
                                size: 48,
                                color: Color(0xFF94A3B8),
                              ),
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Belum ada notifikasi',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'Pemberitahuan status pesanan dan survei akan muncul di sini.',
                              style: TextStyle(
                                fontSize: 13,
                                color: Color(0xFF64748B),
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        color: AppColors.primary,
                        onRefresh: _loadNotifications,
                        child: ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: filtered.length,
                          separatorBuilder: (ctx, i) => const SizedBox(height: 12),
                          itemBuilder: (ctx, i) {
                            final item = filtered[i];
                            return _buildNotificationCard(item);
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _selectedCategory == value;
    return InkWell(
      onTap: () => setState(() => _selectedCategory = value),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
            color: isSelected ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }

  Widget _buildNotificationCard(NotificationItem item) {
    return InkWell(
      onTap: () {
        setState(() => item.isRead = true);
        if (item.category == 'order') {
          Navigator.of(context).pop();
          if (widget.onNavigateToTab != null) {
            widget.onNavigateToTab!(3); // Switch to Orders/Transaction Tab
          }
        }
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: item.isRead ? Colors.white : (item.isUrgent ? const Color(0xFFFFFBEB) : Colors.white),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: item.isUrgent
                ? const Color(0xFFFCD34D)
                : (item.isRead ? const Color(0xFFE2E8F0) : const Color(0xFFBFDBFE)),
            width: item.isUrgent ? 1.5 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
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
                color: item.iconBg,
                shape: BoxShape.circle,
              ),
              child: Icon(item.icon, color: item.iconColor, size: 22),
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
                          item.title,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: item.isUrgent ? const Color(0xFFB45309) : const Color(0xFF0F172A),
                          ),
                        ),
                      ),
                      Text(
                        item.time,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: item.isUrgent ? FontWeight.bold : FontWeight.normal,
                          color: item.isUrgent ? const Color(0xFFD97706) : const Color(0xFF94A3B8),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item.message,
                    style: const TextStyle(
                      fontSize: 13,
                      height: 1.4,
                      color: Color(0xFF475569),
                    ),
                  ),
                  if (item.category == 'order') ...[
                    const SizedBox(height: 8),
                    const Row(
                      children: [
                        Text(
                          'Lihat di menu Transaksi',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                        SizedBox(width: 4),
                        Icon(Icons.arrow_forward_rounded, size: 12, color: AppColors.primary),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
