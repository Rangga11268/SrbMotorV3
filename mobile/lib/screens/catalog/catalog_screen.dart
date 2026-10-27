import 'dart:async';
import 'package:flutter/material.dart';
import '../../app_state.dart';
import '../../models/motor.dart';
import '../home/widgets/motor_card.dart';

class MotorFilterOptions {
  String brand;
  String type;
  String priceRange; // 'Semua', '<25jt', '25-35jt', '35-50jt', '>50jt'
  String sortBy; // 'rekomendasi', 'termurah', 'termahal', 'nama_asc', 'terbaru'
  bool? _onlyAvailable;
  bool? _onlyWishlist;

  bool get onlyAvailable => _onlyAvailable ?? false;
  set onlyAvailable(bool? val) => _onlyAvailable = val ?? false;

  bool get onlyWishlist => _onlyWishlist ?? false;
  set onlyWishlist(bool? val) => _onlyWishlist = val ?? false;

  MotorFilterOptions({
    this.brand = 'Semua',
    this.type = 'Semua',
    this.priceRange = 'Semua',
    this.sortBy = 'rekomendasi',
    bool? onlyAvailable = false,
    bool? onlyWishlist = false,
  })  : _onlyAvailable = onlyAvailable ?? false,
        _onlyWishlist = onlyWishlist ?? false;

  int get activeFilterCount {
    int count = 0;
    if (brand != 'Semua') count++;
    if (type != 'Semua') count++;
    if (priceRange != 'Semua') count++;
    if (sortBy != 'rekomendasi') count++;
    if (onlyAvailable == true) count++;
    if (onlyWishlist == true) count++;
    return count;
  }

  void reset() {
    brand = 'Semua';
    type = 'Semua';
    priceRange = 'Semua';
    sortBy = 'rekomendasi';
    _onlyAvailable = false;
    _onlyWishlist = false;
  }

  MotorFilterOptions copy() {
    return MotorFilterOptions(
      brand: brand,
      type: type,
      priceRange: priceRange,
      sortBy: sortBy,
      onlyAvailable: onlyAvailable,
      onlyWishlist: onlyWishlist,
    );
  }
}

class CatalogScreen extends StatefulWidget {
  final AppState appState;
  final Function(Motor) onMotorTap;

  const CatalogScreen({
    super.key,
    required this.appState,
    required this.onMotorTap,
  });

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  TextEditingController? _searchController;
  MotorFilterOptions? _filter;
  int? _visibleCount;
  Timer? _searchDebounce;

  TextEditingController get searchController => _searchController ??= TextEditingController();
  MotorFilterOptions get filter {
    final f = _filter ??= MotorFilterOptions();
    f._onlyAvailable ??= false;
    f._onlyWishlist ??= false;
    return f;
  }
  set filter(MotorFilterOptions val) => _filter = val;
  int get visibleCount => _visibleCount ??= 6;
  set visibleCount(int val) => _visibleCount = val;

  @override
  void dispose() {
    _searchDebounce?.cancel();
    _searchController?.dispose();
    super.dispose();
  }

  List<String> get _availableBrands {
    final set = <String>{};
    for (final m in widget.appState.motors) {
      if (m.brand.isNotEmpty) set.add(m.brand);
    }
    final list = set.toList()..sort();
    return ['Semua', ...list];
  }

  List<String> get _availableTypes {
    final set = <String>{};
    for (final m in widget.appState.motors) {
      if (m.type.isNotEmpty) set.add(m.type);
    }
    final list = set.toList()..sort();
    return ['Semua', ...list];
  }

  List<Motor> _applyFilter(List<Motor> source, MotorFilterOptions opts, String query) {
    List<Motor> list = List.from(source);

    // Search query
    if (query.isNotEmpty) {
      final q = query.toLowerCase().trim();
      list = list.where((m) {
        return m.name.toLowerCase().contains(q) ||
            m.brand.toLowerCase().contains(q) ||
            m.type.toLowerCase().contains(q) ||
            m.description.toLowerCase().contains(q);
      }).toList();
    }

    // Brand
    if (opts.brand != 'Semua') {
      list = list.where((m) => m.brand.toLowerCase() == opts.brand.toLowerCase()).toList();
    }

    // Type
    if (opts.type != 'Semua') {
      list = list.where((m) => m.type.toLowerCase().contains(opts.type.toLowerCase())).toList();
    }

    // Price Range
    if (opts.priceRange != 'Semua') {
      switch (opts.priceRange) {
        case '<25jt':
          list = list.where((m) => m.price < 25000000).toList();
          break;
        case '25-35jt':
          list = list.where((m) => m.price >= 25000000 && m.price <= 35000000).toList();
          break;
        case '35-50jt':
          list = list.where((m) => m.price > 35000000 && m.price <= 50000000).toList();
          break;
        case '>50jt':
          list = list.where((m) => m.price > 50000000).toList();
          break;
      }
    }

    // Ready Stock
    if (opts.onlyAvailable == true) {
      list = list.where((m) => m.isAvailable && m.stock > 0).toList();
    }

    // Only Wishlist
    if (opts.onlyWishlist == true) {
      list = list.where((m) => widget.appState.isInWishlist(m.id)).toList();
    }

    // Sorting
    switch (opts.sortBy) {
      case 'termurah':
        list.sort((a, b) => a.price.compareTo(b.price));
        break;
      case 'termahal':
        list.sort((a, b) => b.price.compareTo(a.price));
        break;
      case 'nama_asc':
        list.sort((a, b) => a.name.toLowerCase().compareTo(b.name.toLowerCase()));
        break;
      case 'terbaru':
        list.sort((a, b) => b.year.compareTo(a.year));
        break;
      case 'rekomendasi':
      default:
        break;
    }

    return list;
  }

  List<Motor> get _filteredMotors {
    return _applyFilter(
      widget.appState.motors,
      filter,
      searchController.text,
    );
  }

  String _getSortLabel(String key) {
    switch (key) {
      case 'termurah':
        return 'Harga Termurah';
      case 'termahal':
        return 'Harga Termahal';
      case 'nama_asc':
        return 'Nama (A-Z)';
      case 'terbaru':
        return 'Tahun Terbaru';
      case 'rekomendasi':
      default:
        return 'Rekomendasi';
    }
  }

  void _openFilterBottomSheet() {
    final tempFilter = filter.copy();
    final allBrands = _availableBrands;
    final allTypes = _availableTypes;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            final previewCount = _applyFilter(
              widget.appState.motors,
              tempFilter,
              searchController.text,
            ).length;

            return Container(
              height: MediaQuery.of(context).size.height * 0.85,
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
                              'Filter Motor',
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

                  // Filter Content
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
                              label: 'Rekomendasi',
                              isSelected: tempFilter.sortBy == 'rekomendasi',
                              onSelected: () => setSheetState(() => tempFilter.sortBy = 'rekomendasi'),
                            ),
                            _buildChoiceChip(
                              label: 'Harga Termurah',
                              isSelected: tempFilter.sortBy == 'termurah',
                              onSelected: () => setSheetState(() => tempFilter.sortBy = 'termurah'),
                            ),
                            _buildChoiceChip(
                              label: 'Harga Termahal',
                              isSelected: tempFilter.sortBy == 'termahal',
                              onSelected: () => setSheetState(() => tempFilter.sortBy = 'termahal'),
                            ),
                            _buildChoiceChip(
                              label: 'Nama (A-Z)',
                              isSelected: tempFilter.sortBy == 'nama_asc',
                              onSelected: () => setSheetState(() => tempFilter.sortBy = 'nama_asc'),
                            ),
                            _buildChoiceChip(
                              label: 'Tahun Terbaru',
                              isSelected: tempFilter.sortBy == 'terbaru',
                              onSelected: () => setSheetState(() => tempFilter.sortBy = 'terbaru'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Section 2: Merek / Brand
                        _buildSectionTitle('MEREK / BRAND'),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: allBrands.map((b) {
                            return _buildChoiceChip(
                              label: b,
                              isSelected: tempFilter.brand == b,
                              onSelected: () => setSheetState(() => tempFilter.brand = b),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 24),

                        // Section 3: Kategori / Tipe Motor
                        _buildSectionTitle('KATEGORI / TIPE'),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: allTypes.map((t) {
                            return _buildChoiceChip(
                              label: t,
                              isSelected: tempFilter.type == t,
                              onSelected: () => setSheetState(() => tempFilter.type = t),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 24),

                        // Section 4: Rentang Harga
                        _buildSectionTitle('RENTANG HARGA'),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _buildChoiceChip(
                              label: 'Semua Harga',
                              isSelected: tempFilter.priceRange == 'Semua',
                              onSelected: () => setSheetState(() => tempFilter.priceRange = 'Semua'),
                            ),
                            _buildChoiceChip(
                              label: '< Rp 25 Juta',
                              isSelected: tempFilter.priceRange == '<25jt',
                              onSelected: () => setSheetState(() => tempFilter.priceRange = '<25jt'),
                            ),
                            _buildChoiceChip(
                              label: 'Rp 25 - 35 Juta',
                              isSelected: tempFilter.priceRange == '25-35jt',
                              onSelected: () => setSheetState(() => tempFilter.priceRange = '25-35jt'),
                            ),
                            _buildChoiceChip(
                              label: 'Rp 35 - 50 Juta',
                              isSelected: tempFilter.priceRange == '35-50jt',
                              onSelected: () => setSheetState(() => tempFilter.priceRange = '35-50jt'),
                            ),
                            _buildChoiceChip(
                              label: '> Rp 50 Juta',
                              isSelected: tempFilter.priceRange == '>50jt',
                              onSelected: () => setSheetState(() => tempFilter.priceRange = '>50jt'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Section 5: Ketersediaan Unit
                        _buildSectionTitle('STATUS KETERSEDIAAN'),
                        const SizedBox(height: 8),
                        SwitchListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text(
                            'Hanya unit ready stock',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          subtitle: const Text(
                            'Sembunyikan motor yang sedang kosong stok',
                            style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                          ),
                          value: tempFilter.onlyAvailable == true,
                          activeThumbColor: const Color(0xFF1C69D4),
                          onChanged: (val) {
                            setSheetState(() => tempFilter.onlyAvailable = val);
                          },
                        ),
                        const SizedBox(height: 12),
                        SwitchListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text(
                            'Hanya Motor Favorit Saya',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          subtitle: Text(
                            'Tampilkan ${widget.appState.wishlist.length} unit yang tersimpan di wishlist',
                            style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                          ),
                          value: tempFilter.onlyWishlist == true,
                          activeThumbColor: const Color(0xFFEF4444),
                          onChanged: (val) {
                            setSheetState(() => tempFilter.onlyWishlist = val);
                          },
                        ),
                      ],
                    ),
                  ),

                  // Bottom Sticky Action Bar
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
                            visibleCount = 6;
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
                              ? 'Terapkan Filter ($previewCount Motor)'
                              : 'Tidak Ada Motor (Reset)',
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
    return ListenableBuilder(
      listenable: widget.appState,
      builder: (context, _) {
        final motors = _filteredMotors;
        final activeFilters = filter.activeFilterCount;

        return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Katalog Motor',
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
          // Search & Filter Bar Section
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
                                  visibleCount = 6;
                                });
                              }
                            });
                          },
                          decoration: InputDecoration(
                            hintText: 'Cari NMAX, PCX, Vario, Aerox...',
                            hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                            prefixIcon: const Icon(Icons.search, size: 20, color: Color(0xFF64748B)),
                            suffixIcon: searchController.text.isNotEmpty
                                ? IconButton(
                                    icon: const Icon(Icons.clear, size: 18, color: Color(0xFF64748B)),
                                    onPressed: () {
                                      _searchDebounce?.cancel();
                                      searchController.clear();
                                      setState(() {
                                        visibleCount = 6;
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

                // Quick Brand Pills Slider
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _availableBrands.map((brand) {
                      final isSelected = filter.brand == brand;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(brand),
                          selected: isSelected,
                          checkmarkColor: Colors.white,
                          onSelected: (val) {
                            if (val) {
                              setState(() {
                                filter.brand = brand;
                                visibleCount = 6;
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

                // Active Filters Summary Pill Row (if any filter is applied)
                if (activeFilters > 0) ...[
                  const SizedBox(height: 8),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        if (filter.brand != 'Semua')
                          _buildActiveFilterChip('Brand: ${filter.brand}', () {
                            setState(() {
                              filter.brand = 'Semua';
                              visibleCount = 6;
                            });
                          }),
                        if (filter.type != 'Semua')
                          _buildActiveFilterChip('Tipe: ${filter.type}', () {
                            setState(() {
                              filter.type = 'Semua';
                              visibleCount = 6;
                            });
                          }),
                        if (filter.priceRange != 'Semua')
                          _buildActiveFilterChip('Harga: ${filter.priceRange}', () {
                            setState(() {
                              filter.priceRange = 'Semua';
                              visibleCount = 6;
                            });
                          }),
                        if (filter.sortBy != 'rekomendasi')
                          _buildActiveFilterChip(_getSortLabel(filter.sortBy), () {
                            setState(() {
                              filter.sortBy = 'rekomendasi';
                              visibleCount = 6;
                            });
                          }),
                        if (filter.onlyAvailable == true)
                          _buildActiveFilterChip('Ready Stock', () {
                            setState(() {
                              filter.onlyAvailable = false;
                              visibleCount = 6;
                            });
                          }),
                        if (filter.onlyWishlist == true)
                          _buildActiveFilterChip('Favorit Saya', () {
                            setState(() {
                              filter.onlyWishlist = false;
                              visibleCount = 6;
                            });
                          }),
                        InkWell(
                          onTap: () => setState(() {
                            filter.reset();
                            visibleCount = 6;
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

          // Total Count & Sort Status Indicator
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: const Color(0xFFF8FAFC),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Menampilkan ${motors.length} motor',
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

          // Motor List with Pull-to-refresh
          Expanded(
            child: RefreshIndicator(
              color: const Color(0xFF1C69D4),
              onRefresh: () => widget.appState.fetchMotors(),
              child: widget.appState.isLoadingMotors && widget.appState.motors.isEmpty
                  ? _buildSkeletonList()
                  : motors.isEmpty
                      ? _buildEmptyState()
                      : Builder(
                          builder: (context) {
                            final visibleMotors = motors.take(visibleCount).toList();
                            final hasMore = motors.length > visibleCount;

                            return ListView.builder(
                              padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
                              itemCount: visibleMotors.length + (hasMore ? 1 : 0),
                              itemBuilder: (context, index) {
                                if (index < visibleMotors.length) {
                                  final motor = visibleMotors[index];
                                  return MotorCard(
                                    motor: motor,
                                    isWishlisted: widget.appState.isInWishlist(motor.id),
                                    onWishlistToggle: () => widget.appState.toggleWishlist(motor.id),
                                    onTap: () => widget.onMotorTap(motor),
                                  );
                                } else {
                                  final remaining = motors.length - visibleCount;
                                  return Padding(
                                    padding: const EdgeInsets.only(top: 8, bottom: 20),
                                    child: Center(
                                      child: OutlinedButton.icon(
                                        onPressed: () {
                                          setState(() {
                                            visibleCount += 6;
                                          });
                                        },
                                        icon: const Icon(Icons.expand_more_rounded, size: 20),
                                        label: Text('Lihat Lebih Banyak ($remaining Motor Lainnya)'),
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
                          },
                        ),
            ),
          ),
        ],
      ),
    );
      },
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

  Widget _buildSkeletonList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 4,
      itemBuilder: (context, index) => Container(
        height: 110,
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(height: 12, width: 80, color: const Color(0xFFF1F5F9)),
                    const SizedBox(height: 8),
                    Container(height: 16, width: 140, color: const Color(0xFFF1F5F9)),
                    const SizedBox(height: 12),
                    Container(height: 14, width: 100, color: const Color(0xFFF1F5F9)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return ListView(
      padding: const EdgeInsets.all(32),
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
                'Tidak Ada Motor yang Sesuai',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 6),
              const Text(
                'Tidak ada unit motor yang cocok dengan kombinasi filter atau kata kunci saat ini.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  searchController.clear();
                  setState(() {
                    filter.reset();
                    visibleCount = 6;
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
}
