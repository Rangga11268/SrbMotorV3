import 'dart:async';
import 'package:flutter/material.dart';
import '../../app_state.dart';
import '../../models/order.dart';
import '../../widgets/motor_image_view.dart';

class OrderFilterOptions {
  String status; // 'Semua', 'MENUNGGU', 'SURVEI', 'DISETUJUI', 'SELESAI', 'DITOLAK'
  String type; // 'Semua', 'CREDIT', 'CASH'
  String sortBy; // 'terbaru', 'terlama', 'nominal_desc', 'nominal_asc'

  OrderFilterOptions({
    this.status = 'Semua',
    this.type = 'Semua',
    this.sortBy = 'terbaru',
  });

  int get activeFilterCount {
    int count = 0;
    if (status != 'Semua') count++;
    if (type != 'Semua') count++;
    if (sortBy != 'terbaru') count++;
    return count;
  }

  void reset() {
    status = 'Semua';
    type = 'Semua';
    sortBy = 'terbaru';
  }

  OrderFilterOptions copy() {
    return OrderFilterOptions(
      status: status,
      type: type,
      sortBy: sortBy,
    );
  }
}

class OrdersScreen extends StatefulWidget {
  final AppState appState;
  final VoidCallback onExploreCatalog;

  const OrdersScreen({
    super.key,
    required this.appState,
    required this.onExploreCatalog,
  });

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  TextEditingController? _searchController;
  OrderFilterOptions? _filter;
  int? _visibleCount;
  Timer? _searchDebounce;

  TextEditingController get searchController => _searchController ??= TextEditingController();
  OrderFilterOptions get filter => _filter ??= OrderFilterOptions();
  set filter(OrderFilterOptions val) => _filter = val;
  int get visibleCount => _visibleCount ??= 5;
  set visibleCount(int val) => _visibleCount = val;

  @override
  void dispose() {
    _searchDebounce?.cancel();
    _searchController?.dispose();
    super.dispose();
  }

  List<Order> _applyFilter(List<Order> source, OrderFilterOptions opts, String query) {
    List<Order> list = List.from(source);

    // Search query
    if (query.isNotEmpty) {
      final q = query.toLowerCase().trim();
      list = list.where((o) {
        final orderNum = o.orderNumber.toLowerCase();
        final motorName = (o.motor?.name ?? '').toLowerCase();
        final motorBrand = (o.motor?.brand ?? '').toLowerCase();
        final status = o.statusLabel.toLowerCase();
        final type = o.transactionType.toLowerCase();

        return orderNum.contains(q) ||
            motorName.contains(q) ||
            motorBrand.contains(q) ||
            status.contains(q) ||
            type.contains(q);
      }).toList();
    }

    // Status filter
    if (opts.status != 'Semua') {
      list = list.where((o) {
        final s = o.status.toUpperCase();
        switch (opts.status) {
          case 'MENUNGGU':
            return s.contains('TUNGGU') || s.contains('PENDING') || s.contains('WAIT');
          case 'SURVEI':
            return s.contains('SURVEY') || s.contains('SURVEI');
          case 'DISETUJUI':
            return s.contains('APPROV') || s.contains('SETUJU');
          case 'SELESAI':
            return s.contains('SELESAI') || s.contains('COMPLET') || s.contains('LUNAS') || s.contains('PAID');
          case 'DITOLAK':
            return s.contains('REJECT') || s.contains('TOLAK') || s.contains('BATAL') || s.contains('CANCEL');
          default:
            return true;
        }
      }).toList();
    }

    // Transaction Type
    if (opts.type != 'Semua') {
      list = list.where((o) => o.transactionType.toUpperCase() == opts.type.toUpperCase()).toList();
    }

    // Sorting
    switch (opts.sortBy) {
      case 'terlama':
        list.sort((a, b) => a.createdAt.compareTo(b.createdAt));
        break;
      case 'nominal_desc':
        list.sort((a, b) => b.totalAmount.compareTo(a.totalAmount));
        break;
      case 'nominal_asc':
        list.sort((a, b) => a.totalAmount.compareTo(b.totalAmount));
        break;
      case 'terbaru':
      default:
        list.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
    }

    return list;
  }

  List<Order> get _filteredOrders {
    return _applyFilter(
      widget.appState.orders,
      filter,
      searchController.text,
    );
  }

  String _getSortLabel(String key) {
    switch (key) {
      case 'terlama':
        return 'Paling Lama';
      case 'nominal_desc':
        return 'Nominal Tertinggi';
      case 'nominal_asc':
        return 'Nominal Terendah';
      case 'terbaru':
      default:
        return 'Paling Baru';
    }
  }

  String _getStatusLabel(String key) {
    switch (key) {
      case 'MENUNGGU':
        return 'Menunggu Persetujuan';
      case 'SURVEI':
        return 'Jadwal Survei';
      case 'DISETUJUI':
        return 'Disetujui';
      case 'SELESAI':
        return 'Selesai / Lunas';
      case 'DITOLAK':
        return 'Ditolak / Batal';
      case 'Semua':
      default:
        return 'Semua Status';
    }
  }

  void _openFilterBottomSheet() {
    final tempFilter = filter.copy();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            final previewCount = _applyFilter(
              widget.appState.orders,
              tempFilter,
              searchController.text,
            ).length;

            return Container(
              height: MediaQuery.of(context).size.height * 0.75,
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
                        Row(
                          children: [
                            const Text(
                              'Filter Transaksi',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            if (tempFilter.activeFilterCount > 0) ...[
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEFF6FF),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  '${tempFilter.activeFilterCount} Aktif',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF1C69D4),
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                        TextButton(
                          onPressed: () {
                            setSheetState(() => tempFilter.reset());
                          },
                          child: const Text(
                            'Reset Semua',
                            style: TextStyle(
                              color: Color(0xFFEF4444),
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),

                  // Filter Options Body
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                      children: [
                        // Section 1: Urutkan
                        _buildSectionTitle('URUTKAN BERDASARKAN'),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _buildChoiceChip(
                              label: 'Paling Baru',
                              isSelected: tempFilter.sortBy == 'terbaru',
                              onSelected: () => setSheetState(() => tempFilter.sortBy = 'terbaru'),
                            ),
                            _buildChoiceChip(
                              label: 'Paling Lama',
                              isSelected: tempFilter.sortBy == 'terlama',
                              onSelected: () => setSheetState(() => tempFilter.sortBy = 'terlama'),
                            ),
                            _buildChoiceChip(
                              label: 'Nominal Tertinggi',
                              isSelected: tempFilter.sortBy == 'nominal_desc',
                              onSelected: () => setSheetState(() => tempFilter.sortBy = 'nominal_desc'),
                            ),
                            _buildChoiceChip(
                              label: 'Nominal Terendah',
                              isSelected: tempFilter.sortBy == 'nominal_asc',
                              onSelected: () => setSheetState(() => tempFilter.sortBy = 'nominal_asc'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Section 2: Status Transaksi
                        _buildSectionTitle('STATUS TRANSAKSI'),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _buildChoiceChip(
                              label: 'Semua Status',
                              isSelected: tempFilter.status == 'Semua',
                              onSelected: () => setSheetState(() => tempFilter.status = 'Semua'),
                            ),
                            _buildChoiceChip(
                              label: 'Menunggu Persetujuan',
                              isSelected: tempFilter.status == 'MENUNGGU',
                              onSelected: () => setSheetState(() => tempFilter.status = 'MENUNGGU'),
                            ),
                            _buildChoiceChip(
                              label: 'Jadwal Survei',
                              isSelected: tempFilter.status == 'SURVEI',
                              onSelected: () => setSheetState(() => tempFilter.status = 'SURVEI'),
                            ),
                            _buildChoiceChip(
                              label: 'Disetujui',
                              isSelected: tempFilter.status == 'DISETUJUI',
                              onSelected: () => setSheetState(() => tempFilter.status = 'DISETUJUI'),
                            ),
                            _buildChoiceChip(
                              label: 'Selesai / Lunas',
                              isSelected: tempFilter.status == 'SELESAI',
                              onSelected: () => setSheetState(() => tempFilter.status = 'SELESAI'),
                            ),
                            _buildChoiceChip(
                              label: 'Ditolak / Batal',
                              isSelected: tempFilter.status == 'DITOLAK',
                              onSelected: () => setSheetState(() => tempFilter.status = 'DITOLAK'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Section 3: Jenis Transaksi
                        _buildSectionTitle('METODE / JENIS PEMBELIAN'),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _buildChoiceChip(
                              label: 'Semua Metode',
                              isSelected: tempFilter.type == 'Semua',
                              onSelected: () => setSheetState(() => tempFilter.type = 'Semua'),
                            ),
                            _buildChoiceChip(
                              label: 'Pengajuan Kredit',
                              isSelected: tempFilter.type == 'CREDIT',
                              onSelected: () => setSheetState(() => tempFilter.type = 'CREDIT'),
                            ),
                            _buildChoiceChip(
                              label: 'Tunai (Cash)',
                              isSelected: tempFilter.type == 'CASH',
                              onSelected: () => setSheetState(() => tempFilter.type = 'CASH'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Bottom Action Bar
                  Container(
                    padding: EdgeInsets.fromLTRB(
                      20,
                      12,
                      20,
                      MediaQuery.of(context).padding.bottom + 12,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: const Border(top: BorderSide(color: Color(0xFFF1F5F9))),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 10,
                          offset: const Offset(0, -4),
                        ),
                      ],
                    ),
                    child: SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            filter = tempFilter;
                            visibleCount = 5;
                          });
                          Navigator.pop(ctx);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1C69D4),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        child: Text(
                          previewCount > 0
                              ? 'Terapkan Filter ($previewCount Transaksi)'
                              : 'Tidak Ada Transaksi (Reset)',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.3,
                          ),
                        ),
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

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 11.5,
        fontWeight: FontWeight.w800,
        letterSpacing: 1.0,
        color: Color(0xFF64748B),
      ),
    );
  }

  Widget _buildChoiceChip({
    required String label,
    required bool isSelected,
    required VoidCallback onSelected,
  }) {
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      checkmarkColor: Colors.white,
      onSelected: (_) => onSelected(),
      labelStyle: TextStyle(
        fontSize: 12.5,
        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
        color: isSelected ? Colors.white : const Color(0xFF334155),
      ),
      selectedColor: const Color(0xFF1C69D4),
      backgroundColor: const Color(0xFFF8FAFC),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(
          color: isSelected ? const Color(0xFF1C69D4) : const Color(0xFFE2E8F0),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.appState.isAuthenticated) {
      return Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          title: const Text(
            'Pesanan & Transaksi',
            style: TextStyle(
              color: Color(0xFF0F172A),
              fontWeight: FontWeight.w800,
              fontSize: 18,
            ),
          ),
          backgroundColor: Colors.white,
          elevation: 0,
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.receipt_long_rounded, size: 40, color: Color(0xFF1C69D4)),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Masuk Untuk Melihat Transaksi',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Pantau status verifikasi berkas, pengajuan kredit, dan jadwal pengiriman unit motor Anda.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => Navigator.of(context).pushNamed('/login'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1C69D4),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: const Text('Masuk ke Akun', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final orders = _filteredOrders;
    final activeFilters = filter.activeFilterCount;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Pesanan & Transaksi',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(color: const Color(0xFFE2E8F0), height: 1),
        ),
      ),
      body: Column(
        children: [
          // Search & Filter Header
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Search Input + Dedicated Filter Button
                Row(
                  children: [
                    // Search Bar
                    Expanded(
                      child: Container(
                        height: 46,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: TextField(
                          controller: searchController,
                          onChanged: (_) {
                            _searchDebounce?.cancel();
                            _searchDebounce = Timer(const Duration(milliseconds: 180), () {
                              if (mounted) {
                                setState(() {
                                  visibleCount = 5;
                                });
                              }
                            });
                          },
                          decoration: InputDecoration(
                            hintText: 'Cari nomor order, motor, status...',
                            hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                            prefixIcon: const Icon(Icons.search, size: 20, color: Color(0xFF64748B)),
                            suffixIcon: searchController.text.isNotEmpty
                                ? IconButton(
                                    icon: const Icon(Icons.clear, size: 18, color: Color(0xFF64748B)),
                                    onPressed: () {
                                      _searchDebounce?.cancel();
                                      searchController.clear();
                                      setState(() {
                                        visibleCount = 5;
                                      });
                                    },
                                  )
                                : null,
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                          ),
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),

                    // Dedicated Filter Button with Active Counter Badge
                    Material(
                      color: activeFilters > 0 ? const Color(0xFF1C69D4) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      child: InkWell(
                        onTap: _openFilterBottomSheet,
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          height: 46,
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: activeFilters > 0
                                  ? const Color(0xFF1C69D4)
                                  : const Color(0xFFCBD5E1),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.tune_rounded,
                                size: 20,
                                color: activeFilters > 0 ? Colors.white : const Color(0xFF0F172A),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Filter',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: activeFilters > 0 ? Colors.white : const Color(0xFF0F172A),
                                ),
                              ),
                              if (activeFilters > 0) ...[
                                const SizedBox(width: 6),
                                Container(
                                  width: 18,
                                  height: 18,
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Center(
                                    child: Text(
                                      activeFilters.toString(),
                                      style: const TextStyle(
                                        fontSize: 10.5,
                                        fontWeight: FontWeight.w900,
                                        color: Color(0xFF1C69D4),
                                        height: 1,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Quick Status Pills Slider
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      'Semua',
                      'MENUNGGU',
                      'SURVEI',
                      'DISETUJUI',
                      'SELESAI',
                      'DITOLAK',
                    ].map((st) {
                      final isSelected = filter.status == st;
                      final label = st == 'Semua' ? 'Semua Status' : _getStatusLabel(st);
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(label),
                          selected: isSelected,
                          checkmarkColor: Colors.white,
                          onSelected: (val) {
                            if (val) {
                              setState(() {
                                filter.status = st;
                                visibleCount = 5;
                              });
                            }
                          },
                          labelStyle: TextStyle(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isSelected ? Colors.white : const Color(0xFF475569),
                          ),
                          selectedColor: const Color(0xFF0F172A),
                          backgroundColor: const Color(0xFFF1F5F9),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          side: BorderSide.none,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        ),
                      );
                    }).toList(),
                  ),
                ),

                // Active Filters Summary Pills (if any)
                if (activeFilters > 0) ...[
                  const SizedBox(height: 8),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        if (filter.status != 'Semua')
                          _buildActiveFilterChip('Status: ${_getStatusLabel(filter.status)}', () {
                            setState(() {
                              filter.status = 'Semua';
                              visibleCount = 5;
                            });
                          }),
                        if (filter.type != 'Semua')
                          _buildActiveFilterChip('Jenis: ${filter.type == 'CREDIT' ? 'Kredit' : 'Tunai'}', () {
                            setState(() {
                              filter.type = 'Semua';
                              visibleCount = 5;
                            });
                          }),
                        if (filter.sortBy != 'terbaru')
                          _buildActiveFilterChip(_getSortLabel(filter.sortBy), () {
                            setState(() {
                              filter.sortBy = 'terbaru';
                              visibleCount = 5;
                            });
                          }),
                        InkWell(
                          onTap: () => setState(() {
                            filter.reset();
                            visibleCount = 5;
                          }),
                          child: const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            child: Text(
                              'Reset Semua',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFFEF4444),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Total Count & Sort Status Row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: const Color(0xFFF8FAFC),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Menampilkan ${orders.length} transaksi',
                  style: const TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF64748B),
                  ),
                ),
                InkWell(
                  onTap: _openFilterBottomSheet,
                  child: Row(
                    children: [
                      const Icon(Icons.sort_rounded, size: 14, color: Color(0xFF1C69D4)),
                      const SizedBox(width: 4),
                      Text(
                        _getSortLabel(filter.sortBy),
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF1C69D4),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // List Content with Pull-to-refresh & See More
          Expanded(
            child: RefreshIndicator(
              color: const Color(0xFF1C69D4),
              onRefresh: () => widget.appState.fetchOrders(),
              child: _buildBody(orders),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveFilterChip(String label, VoidCallback onRemove) {
    return Container(
      margin: const EdgeInsets.only(right: 6),
      padding: const EdgeInsets.fromLTRB(8, 4, 4, 4),
      decoration: BoxDecoration(
        color: const Color(0xFFEFF6FF),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: const Color(0xFFBFDBFE)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1C69D4),
            ),
          ),
          const SizedBox(width: 2),
          InkWell(
            onTap: onRemove,
            child: const Icon(
              Icons.close_rounded,
              size: 14,
              color: Color(0xFF1C69D4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody(List<Order> orders) {
    if (widget.appState.isLoadingOrders && widget.appState.orders.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFF1C69D4)),
      );
    }

    if (widget.appState.orderError != null && widget.appState.orders.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.cloud_off_rounded, size: 48, color: Color(0xFF94A3B8)),
              const SizedBox(height: 12),
              Text(
                widget.appState.orderError!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () => widget.appState.fetchOrders(),
                icon: const Icon(Icons.refresh, size: 16),
                label: const Text('Coba Lagi'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF1C69D4),
                  side: const BorderSide(color: Color(0xFF1C69D4)),
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (widget.appState.orders.isEmpty) {
      return ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const SizedBox(height: 60),
          Center(
            child: Column(
              children: [
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.inventory_2_outlined, size: 36, color: Color(0xFF94A3B8)),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Belum Ada Riwayat Pesanan',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Anda belum memiliki transaksi motor tunai maupun kredit di SRB Motor.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 24),
                OutlinedButton(
                  onPressed: widget.onExploreCatalog,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF1C69D4),
                    side: const BorderSide(color: Color(0xFF1C69D4)),
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('Jelajahi Katalog Motor', style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ],
            ),
          ),
        ],
      );
    }

    if (orders.isEmpty) {
      return ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const SizedBox(height: 40),
          Center(
            child: Column(
              children: [
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.search_off_rounded, size: 36, color: Color(0xFF94A3B8)),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Tidak Ada Transaksi yang Sesuai',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Coba ubah kata kunci pencarian atau sesuaikan filter status dan metode pembelian.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  onPressed: () {
                    searchController.clear();
                    setState(() {
                      filter.reset();
                      visibleCount = 5;
                    });
                  },
                  icon: const Icon(Icons.refresh_rounded, size: 16),
                  label: const Text('Reset Filter & Pencarian'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1C69D4),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
        ],
      );
    }

    final visibleOrders = orders.take(visibleCount).toList();
    final hasMore = orders.length > visibleCount;

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
      itemCount: visibleOrders.length + (hasMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index < visibleOrders.length) {
          final order = visibleOrders[index];
          return _orderCard(context, order);
        } else {
          // See More Action Button
          final remaining = orders.length - visibleCount;
          return Padding(
            padding: const EdgeInsets.only(top: 8, bottom: 20),
            child: Center(
              child: OutlinedButton.icon(
                onPressed: () {
                  setState(() {
                    visibleCount += 5;
                  });
                },
                icon: const Icon(Icons.expand_more_rounded, size: 20),
                label: Text('Lihat Lebih Banyak ($remaining Transaksi Lainnya)'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF1C69D4),
                  side: const BorderSide(color: Color(0xFFBFDBFE)),
                  backgroundColor: const Color(0xFFEFF6FF),
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                ),
              ),
            ),
          );
        }
      },
    );
  }

  void _showOrderDetailSheet(BuildContext context, Order order) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: EdgeInsets.fromLTRB(20, 16, 20, MediaQuery.of(context).padding.bottom + 20),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Detail Transaksi',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const Divider(color: Color(0xFFF1F5F9)),
              const SizedBox(height: 8),

              // Order Number & Date
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Nomor Pesanan', style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                      Text(order.orderNumber, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text('Tanggal', style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                      Text(order.formattedDate, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Status Summary
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline_rounded, color: Color(0xFF1C69D4), size: 20),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Status: ${order.statusLabel}',
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                          ),
                          Text(
                            'Metode: ${order.transactionType == 'CREDIT' ? 'Kredit Motor' : 'Pembelian Tunai'}',
                            style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Motor Info
              if (order.motor != null) ...[
                Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        width: 72,
                        height: 64,
                        color: const Color(0xFFF8FAFC),
                        child: MotorImageView(
                          imageUrl: order.motor?.displayImageUrl,
                          assetPath: order.motor?.imagePath,
                          fit: BoxFit.contain,
                          width: 72,
                          height: 64,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            order.motor!.name,
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                          ),
                          Text(
                            '${order.motor!.brand} • ${order.motor!.type}',
                            style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                          ),
                          Text(
                            order.formattedTotal,
                            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF1C69D4)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
              ],

              // Overdue Survey Notice Card
              if (order.transactionType == 'CREDIT' && order.isSurveyOverdue) ...[
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFFBEB),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFFDE68A)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.access_time_filled_rounded, size: 18, color: Color(0xFFD97706)),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Jadwal Survei Telah Terlewati',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF92400E),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Tanggal survei unit ini sudah lewat. Mohon bantu kami memperbarui proses pengajuan Anda dengan memilih status terkini:',
                        style: TextStyle(fontSize: 11.5, color: Color(0xFF78350F), height: 1.4),
                      ),
                      const SizedBox(height: 12),
                      if (order.isSurveyConfirmed) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFECFDF5),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFFA7F3D0)),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.check_circle_rounded, size: 16, color: Color(0xFF059669)),
                              SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'Anda telah mengonfirmasi bahwa survei selesai. Tim SRB Motor sedang memverifikasi berkas bersama leasing.',
                                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF065F46)),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ] else ...[
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: () async {
                                  final navigator = Navigator.of(ctx);
                                  final messenger = ScaffoldMessenger.of(context);
                                  final res = await widget.appState.confirmSurveyDone(order.id);
                                  navigator.pop();
                                  messenger.showSnackBar(
                                    SnackBar(
                                      content: Text(res['message'] ?? 'Konfirmasi survei tercatat.'),
                                      backgroundColor: res['success'] == true ? const Color(0xFF059669) : const Color(0xFFEF4444),
                                    ),
                                  );
                                },
                                icon: const Icon(Icons.check_circle_outline_rounded, size: 16),
                                label: const Text('Sudah Disurvei'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF1C69D4),
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 10),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                  textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                                  elevation: 0,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: () {
                                  Navigator.pop(ctx);
                                  final motorName = order.motor?.name ?? 'Motor';
                                  final waMsg = Uri.encodeComponent(
                                    'Halo Admin SRB Motor, saya ingin menanyakan pengajuan kredit #${order.orderNumber} unit $motorName. Jadwal survei telah lewat dan belum ada petugas yang hadir. Mohon bantuan informasi atau jadwal ulang.',
                                  );
                                  final waUrl = 'https://wa.me/6282123456789?text=$waMsg';
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('Hubungi CS WhatsApp: $waUrl'),
                                      duration: const Duration(seconds: 4),
                                      behavior: SnackBarBehavior.floating,
                                    ),
                                  );
                                },
                                icon: const Icon(Icons.help_outline_rounded, size: 16),
                                label: const Text('Belum Disurvei'),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: const Color(0xFF92400E),
                                  side: const BorderSide(color: Color(0xFFF59E0B)),
                                  backgroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 10),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                  textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Financial Breakdown
              if (order.transactionType == 'CREDIT') ...[
                _buildSummaryRow('Uang Muka (DP)', order.formattedDp),
                const SizedBox(height: 6),
                _buildSummaryRow('Angsuran per Bulan', '${order.formattedAngsuran} / bln'),
                const SizedBox(height: 6),
                _buildSummaryRow('Jangka Waktu (Tenor)', order.tenor != null && order.tenor! > 0 ? '${order.tenor} Bulan' : '-'),
                const Divider(height: 20, color: Color(0xFFF1F5F9)),
              ],

              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Layanan pelanggan: Hubungi CS WhatsApp di +62 821-2345-6789'),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  icon: const Icon(Icons.chat_rounded, size: 18),
                  label: const Text('Bantuan / Hubungi Customer Service'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1C69D4),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
      ],
    );
  }

  Widget _orderCard(BuildContext context, Order order) {
    Color badgeColor = const Color(0xFFEFF6FF);
    Color badgeTextColor = const Color(0xFF1C69D4);

    final s = order.status.toUpperCase();
    if (s.contains('APPROV') || s.contains('SELESAI') || s.contains('COMPLET') || s.contains('SETUJU')) {
      badgeColor = const Color(0xFFECFDF5);
      badgeTextColor = const Color(0xFF059669);
    } else if (s.contains('REJECT') || s.contains('CANCEL') || s.contains('TOLAK') || s.contains('BATAL')) {
      badgeColor = const Color(0xFFFEF2F2);
      badgeTextColor = const Color(0xFFDC2626);
    } else if (s.contains('SURVEY') || s.contains('TUNGGU') || s.contains('WAIT') || s.contains('PENDING')) {
      badgeColor = const Color(0xFFFFFBEB);
      badgeTextColor = const Color(0xFFD97706);
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 0.8),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showOrderDetailSheet(context, order),
          borderRadius: BorderRadius.circular(14),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header: Order Number & Status Badge
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F172A),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            order.transactionType,
                            style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          order.orderNumber,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF475569)),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: badgeColor,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        order.statusLabel,
                        style: TextStyle(color: badgeTextColor, fontSize: 11, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
                const Divider(height: 20, color: Color(0xFFF1F5F9)),

                // Motor Details Row
                Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        width: 72,
                        height: 64,
                        color: const Color(0xFFF8FAFC),
                        child: MotorImageView(
                          imageUrl: order.motor?.displayImageUrl,
                          assetPath: order.motor?.imagePath,
                          fit: BoxFit.contain,
                          width: 72,
                          height: 64,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            order.motor?.name ?? 'Unit Motor',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Color(0xFF0F172A)),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            order.formattedDate,
                            style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            order.transactionType == 'CREDIT' ? 'DP: ${order.formattedDp}' : order.formattedTotal,
                            style: const TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF1C69D4), fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8), size: 20),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
