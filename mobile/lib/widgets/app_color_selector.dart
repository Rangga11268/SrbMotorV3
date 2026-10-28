import 'package:flutter/material.dart';

class AutomotiveColorSpec {
  final String name;
  final List<Color> gradientColors;
  final bool isLight;

  const AutomotiveColorSpec({
    required this.name,
    required this.gradientColors,
    this.isLight = false,
  });

  static AutomotiveColorSpec resolve(String rawName) {
    final lower = rawName.toLowerCase().trim();

    if (lower.contains('putih') || lower.contains('white') || lower.contains('pearl')) {
      return AutomotiveColorSpec(
        name: rawName,
        gradientColors: const [Color(0xFFFFFFFF), Color(0xFFF8FAFC), Color(0xFFCBD5E1)],
        isLight: true,
      );
    }
    if (lower.contains('merah') || lower.contains('red') || lower.contains('candy')) {
      return AutomotiveColorSpec(
        name: rawName,
        gradientColors: const [Color(0xFFF87171), Color(0xFFDC2626), Color(0xFF991B1B)],
      );
    }
    if (lower.contains('biru') || lower.contains('blue') || lower.contains('cyan') || lower.contains('cyber')) {
      return AutomotiveColorSpec(
        name: rawName,
        gradientColors: const [Color(0xFF60A5FA), Color(0xFF2563EB), Color(0xFF1E3A8A)],
      );
    }
    if (lower.contains('abu') || lower.contains('grey') || lower.contains('silver')) {
      return AutomotiveColorSpec(
        name: rawName,
        gradientColors: const [Color(0xFFE2E8F0), Color(0xFF94A3B8), Color(0xFF475569)],
      );
    }
    if (lower.contains('kuning') || lower.contains('yellow') || lower.contains('gold')) {
      return AutomotiveColorSpec(
        name: rawName,
        gradientColors: const [Color(0xFFFDE047), Color(0xFFEAB308), Color(0xFFCA8A04)],
        isLight: true,
      );
    }
    if (lower.contains('hijau') || lower.contains('green')) {
      return AutomotiveColorSpec(
        name: rawName,
        gradientColors: const [Color(0xFF34D399), Color(0xFF059669), Color(0xFF064E3B)],
      );
    }
    if (lower.contains('cokelat') || lower.contains('brown') || lower.contains('bronze')) {
      return AutomotiveColorSpec(
        name: rawName,
        gradientColors: const [Color(0xFFD97706), Color(0xFF92400E), Color(0xFF451A03)],
      );
    }

    // Default to obsidian / matte black
    return AutomotiveColorSpec(
      name: rawName,
      gradientColors: const [Color(0xFF4B5563), Color(0xFF1F2937), Color(0xFF0F172A)],
    );
  }
}

class AppColorSelector extends StatelessWidget {
  final List<String> colors;
  final String selectedColor;
  final ValueChanged<String> onColorSelected;
  final bool showHeader;
  final String title;

  const AppColorSelector({
    super.key,
    required this.colors,
    required this.selectedColor,
    required this.onColorSelected,
    this.showHeader = true,
    this.title = 'Warna Pilihan',
  });

  @override
  Widget build(BuildContext context) {
    final list = colors.isNotEmpty ? colors : const ['Hitam', 'Putih', 'Merah'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (showHeader) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: const Color(0xFFBFDBFE)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Terpilih: ',
                      style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                    ),
                    Text(
                      selectedColor,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF1D4ED8),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
        ],
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: list.map((color) {
            final isSelected = selectedColor.trim().toLowerCase() == color.trim().toLowerCase();
            final spec = AutomotiveColorSpec.resolve(color);

            return InkWell(
              onTap: () => onColorSelected(color),
              borderRadius: BorderRadius.circular(12),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFFF0F7FF) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected ? const Color(0xFF1D4ED8) : const Color(0xFFE2E8F0),
                    width: isSelected ? 1.8 : 1.2,
                  ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: const Color(0xFF1D4ED8).withValues(alpha: 0.16),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ]
                      : [
                          BoxShadow(
                            color: const Color(0xFF0F172A).withValues(alpha: 0.03),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Metallic 3D Automotive Color Disc
                    Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: spec.gradientColors,
                        ),
                        border: Border.all(
                          color: spec.isLight ? const Color(0xFF94A3B8) : Colors.white.withValues(alpha: 0.4),
                          width: 1.2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.18),
                            blurRadius: 3,
                            offset: const Offset(0, 1.5),
                          ),
                        ],
                      ),
                      child: isSelected
                          ? Center(
                              child: Icon(
                                Icons.check,
                                size: 13,
                                color: spec.isLight ? const Color(0xFF0F172A) : Colors.white,
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      color,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                        color: isSelected ? const Color(0xFF0F172A) : const Color(0xFF475569),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
