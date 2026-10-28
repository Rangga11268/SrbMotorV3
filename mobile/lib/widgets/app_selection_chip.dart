import 'package:flutter/material.dart';

class AppSelectionChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;
  final IconData? icon;
  final Color? colorDot;

  const AppSelectionChip({
    super.key,
    required this.label,
    required this.isSelected,
    required this.onTap,
    this.icon,
    this.colorDot,
  });

  /// Helper to resolve common automotive color names to preview dot colors
  static Color? resolveColorDot(String colorName) {
    final lower = colorName.toLowerCase().trim();
    if (lower.contains('hitam') || lower.contains('black')) return const Color(0xFF1E293B);
    if (lower.contains('putih') || lower.contains('white')) return const Color(0xFFF8FAFC);
    if (lower.contains('merah') || lower.contains('red')) return const Color(0xFFDC2626);
    if (lower.contains('biru') || lower.contains('blue')) return const Color(0xFF2563EB);
    if (lower.contains('abu') || lower.contains('grey') || lower.contains('silver')) return const Color(0xFF94A3B8);
    if (lower.contains('kuning') || lower.contains('yellow')) return const Color(0xFFF59E0B);
    if (lower.contains('cyber') || lower.contains('cyan')) return const Color(0xFF06B6D4);
    if (lower.contains('hijau') || lower.contains('green')) return const Color(0xFF10B981);
    if (lower.contains('matte') || lower.contains('doff')) return const Color(0xFF334155);
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final dot = colorDot ?? resolveColorDot(label);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 160),
      curve: Curves.easeInOut,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(10),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8.5),
            decoration: BoxDecoration(
              color: isSelected ? const Color(0xFF1C69D4) : Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: isSelected ? const Color(0xFF1C69D4) : const Color(0xFFCBD5E1),
                width: isSelected ? 1.5 : 1.0,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: const Color(0xFF1C69D4).withValues(alpha: 0.22),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ]
                  : null,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (dot != null) ...[
                  Container(
                    width: 11,
                    height: 11,
                    decoration: BoxDecoration(
                      color: dot,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isSelected ? Colors.white : const Color(0xFF94A3B8),
                        width: 1.2,
                      ),
                    ),
                  ),
                  const SizedBox(width: 7),
                ] else if (icon != null) ...[
                  Icon(
                    icon,
                    size: 14,
                    color: isSelected ? Colors.white : const Color(0xFF64748B),
                  ),
                  const SizedBox(width: 6),
                ],
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                    color: isSelected ? Colors.white : const Color(0xFF334155),
                    letterSpacing: 0.15,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
