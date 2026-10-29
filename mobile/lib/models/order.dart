import 'package:intl/intl.dart';
import 'motor.dart';

class InstallmentItem {
  final int id;
  final int installmentNumber;
  final double amount;
  final double penaltyAmount;
  final String? dueDate;
  final String status; // 'paid', 'pending', 'overdue'
  final String? paidAt;

  InstallmentItem({
    required this.id,
    required this.installmentNumber,
    required this.amount,
    this.penaltyAmount = 0,
    this.dueDate,
    required this.status,
    this.paidAt,
  });

  bool get isPaid => status.toLowerCase() == 'paid';
  bool get isOverdue => status.toLowerCase() == 'overdue';

  factory InstallmentItem.fromJson(Map<String, dynamic> json) {
    final rawAmt = json['amount'] ?? 0;
    final double amt = rawAmt is num ? rawAmt.toDouble() : double.tryParse(rawAmt.toString()) ?? 0;
    final rawPen = json['penalty_amount'] ?? 0;
    final double pen = rawPen is num ? rawPen.toDouble() : double.tryParse(rawPen.toString()) ?? 0;

    return InstallmentItem(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id']?.toString() ?? '0') ?? 0,
      installmentNumber: json['installment_number'] is int
          ? json['installment_number']
          : int.tryParse(json['installment_number']?.toString() ?? '1') ?? 1,
      amount: amt,
      penaltyAmount: pen,
      dueDate: json['due_date']?.toString(),
      status: json['status']?.toString().toLowerCase() ?? 'pending',
      paidAt: json['paid_at']?.toString(),
    );
  }
}

class Order {
  final int id;
  final String orderNumber;
  final String transactionType; // 'CASH' or 'CREDIT'
  final String status;
  final double totalAmount;
  final double dpAmount;
  final int? tenor;
  final double? monthlyInstallment;
  final DateTime createdAt;
  final Motor? motor;
  final bool? _isSurveyOverdue;
  final String? surveyDate;
  final String? surveyorName;
  final String? surveyorPhone;
  final bool? _isSurveyConfirmed;
  final String? leasingProvider;
  final String? contractNumber;
  final List<InstallmentItem> installments;

  bool get isSurveyOverdue => _isSurveyOverdue ?? false;
  bool get isSurveyConfirmed => _isSurveyConfirmed ?? false;
  bool get isCredit => transactionType.toUpperCase() == 'CREDIT';
  String get motorName => motor?.name ?? 'Unit Motor';
  String get referenceNumber => orderNumber;
  String get createdAtFormatted => formattedDate;

  bool get hasActiveLeasing {
    if (!isCredit) return false;
    final s = status.toUpperCase();
    return s.contains('APPROV') ||
        s.contains('SELESAI') ||
        s.contains('COMPLET') ||
        s.contains('SETUJU') ||
        s.contains('DELIVER') ||
        s.contains('PREPARATION');
  }

  int get paidInstallmentsCount {
    if (installments.isNotEmpty) {
      return installments.where((i) => i.isPaid).length;
    }
    return 0;
  }

  int get totalInstallmentsCount {
    if (tenor != null && tenor! > 0) return tenor!;
    if (installments.isNotEmpty) return installments.length;
    return 36;
  }

  int get remainingInstallmentsCount {
    final rem = totalInstallmentsCount - paidInstallmentsCount;
    return rem < 0 ? 0 : rem;
  }

  InstallmentItem? get nextInstallment {
    try {
      return installments.firstWhere((i) => !i.isPaid);
    } catch (_) {
      return null;
    }
  }

  String get nextDueDateFormatted {
    final next = nextInstallment;
    if (next?.dueDate != null && next!.dueDate!.isNotEmpty) {
      try {
        final parsed = DateTime.parse(next.dueDate!);
        try {
          return DateFormat('dd MMM yyyy', 'id_ID').format(parsed);
        } catch (_) {
          return DateFormat('dd MMM yyyy').format(parsed);
        }
      } catch (_) {
        return next.dueDate!;
      }
    }
    final estDate = createdAt.add(Duration(days: 30 * (paidInstallmentsCount + 1)));
    try {
      return DateFormat('dd MMM yyyy', 'id_ID').format(estDate);
    } catch (_) {
      return DateFormat('dd MMM yyyy').format(estDate);
    }
  }

  Order({
    required this.id,
    required this.orderNumber,
    required this.transactionType,
    required this.status,
    required this.totalAmount,
    this.dpAmount = 0,
    this.tenor,
    this.monthlyInstallment,
    required this.createdAt,
    this.motor,
    bool? isSurveyOverdue = false,
    this.surveyDate,
    this.surveyorName,
    this.surveyorPhone,
    bool? isSurveyConfirmed = false,
    this.leasingProvider,
    this.contractNumber,
    this.installments = const [],
  })  : _isSurveyOverdue = isSurveyOverdue ?? false,
        _isSurveyConfirmed = isSurveyConfirmed ?? false;

  factory Order.fromJson(Map<String, dynamic> json) {
    DateTime parsedDate = DateTime.now();
    if (json['created_at'] != null) {
      try {
        parsedDate = DateTime.parse(json['created_at']);
      } catch (_) {}
    }

    final rawTotal = json['total_amount'] ?? json['total_price'] ?? 0;
    final double total = rawTotal is num ? rawTotal.toDouble() : double.tryParse(rawTotal.toString()) ?? 0;

    final rawDp = json['dp_amount'] ??
        json['down_payment'] ??
        json['booking_fee'] ??
        (json['credit_detail'] is Map ? json['credit_detail']['down_payment'] : null) ??
        0;
    final double dp = rawDp is num ? rawDp.toDouble() : double.tryParse(rawDp.toString()) ?? 0;

    final rawMonthly = json['angsuran_per_bulan'] ??
        json['monthly_installment'] ??
        (json['credit_detail'] is Map ? json['credit_detail']['angsuran_per_bulan'] : null);
    final double? monthly = rawMonthly is num ? rawMonthly.toDouble() : (rawMonthly != null ? double.tryParse(rawMonthly.toString()) : null);

    final rawTenor = json['tenor'] ?? (json['credit_detail'] is Map ? json['credit_detail']['tenor'] : null);

    Motor? motorObj;
    if (json['motor'] is Map<String, dynamic>) {
      motorObj = Motor.fromJson(json['motor']);
    }

    final surveyInfo = json['survey_info'] is Map ? json['survey_info'] : null;
    final bool rawOverdue = surveyInfo != null ? (surveyInfo['is_overdue'] == true) : false;
    final bool sConfirmed = (surveyInfo != null && surveyInfo['customer_confirmed_at'] != null);
    final String? sDate = surveyInfo?['scheduled_date']?.toString();
    final String? sName = surveyInfo?['surveyor_name']?.toString();
    final String? sPhone = surveyInfo?['surveyor_phone']?.toString();

    // Fallback: If credit transaction status mentions SURVEI / JADWAL and order was created more than 2 days ago
    final rawStatus = (json['status']?.toString() ?? '').toUpperCase();
    final bool isSurveyStatus = rawStatus.contains('SURVEI') || rawStatus.contains('SURVEY') || rawStatus.contains('JADWAL');
    final bool fallbackOverdue = (json['transaction_type']?.toString().toUpperCase() == 'CREDIT') &&
        isSurveyStatus &&
        parsedDate.isBefore(DateTime.now().subtract(const Duration(days: 2)));

    final bool isOverdue = rawOverdue || fallbackOverdue;

    final creditDetail = json['credit_detail'] is Map ? json['credit_detail'] : null;
    final String? lProvider = creditDetail?['leasing_provider']?.toString() ?? json['leasing_provider']?.toString();
    final String? cNumber = creditDetail?['reference_number']?.toString() ??
        json['contract_number']?.toString() ??
        json['reference_number']?.toString();

    List<InstallmentItem> parsedInstallments = [];
    if (json['installments'] is List) {
      for (final item in json['installments']) {
        if (item is Map<String, dynamic>) {
          parsedInstallments.add(InstallmentItem.fromJson(item));
        } else if (item is Map) {
          parsedInstallments.add(InstallmentItem.fromJson(Map<String, dynamic>.from(item)));
        }
      }
    }

    return Order(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      orderNumber: json['order_number']?.toString() ?? json['id']?.toString() ?? 'TRX-000',
      transactionType: json['transaction_type']?.toString().toUpperCase() ?? 'CASH',
      status: json['status']?.toString().toUpperCase() ?? 'PENDING',
      totalAmount: total,
      dpAmount: dp,
      tenor: rawTenor is int ? rawTenor : int.tryParse(rawTenor?.toString() ?? ''),
      monthlyInstallment: monthly,
      createdAt: parsedDate,
      motor: motorObj,
      isSurveyOverdue: isOverdue,
      surveyDate: sDate,
      surveyorName: sName,
      surveyorPhone: sPhone,
      isSurveyConfirmed: sConfirmed,
      leasingProvider: lProvider,
      contractNumber: cNumber,
      installments: parsedInstallments,
    );
  }

  String get formattedDate {
    try {
      return DateFormat('dd MMM yyyy, HH:mm', 'id_ID').format(createdAt);
    } catch (_) {
      try {
        return DateFormat('dd MMM yyyy, HH:mm').format(createdAt);
      } catch (_) {
        return '${createdAt.day.toString().padLeft(2, '0')}/${createdAt.month.toString().padLeft(2, '0')}/${createdAt.year} ${createdAt.hour.toString().padLeft(2, '0')}:${createdAt.minute.toString().padLeft(2, '0')}';
      }
    }
  }

  String get formattedTotal {
    return NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0).format(totalAmount);
  }

  String get formattedDp {
    return NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0).format(dpAmount);
  }

  String get formattedAngsuran {
    if (monthlyInstallment != null && monthlyInstallment! > 0) {
      return NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0).format(monthlyInstallment);
    }
    return '-';
  }

  String get statusLabel {
    final clean = status.trim().toUpperCase();
    switch (clean) {
      // Survey & Verification
      case 'SURVEY_SCHEDULED':
      case 'JADWAL_SURVEY':
        return 'Jadwal Survei';
      case 'MENUNGGU_PERSETUJUAN':
      case 'WAITING_APPROVAL':
      case 'WAITING_CREDIT_APPROVAL':
        return 'Menunggu Persetujuan';
      case 'SURVEY':
      case 'SEDANG_DISURVEY':
        return 'Sedang Disurvei';
      case 'SURVEY_COMPLETED':
      case 'SURVEY_SELESAI':
        return 'Survei Selesai';
      case 'PROSES_SURVEYOR':
      case 'DIKIRIM_KE_SURVEYOR':
        return 'Proses Surveyor';
      case 'PENDING':
      case 'NEW_ORDER':
      case 'PESANAN_MASUK':
        return 'Menunggu Verifikasi';
      case 'VERIFIED':
      case 'VERIFIKASI_BERKAS':
        return 'Berkas Terverifikasi';
      case 'WAITING_PAYMENT':
      case 'MENUNGGU_PEMBAYARAN':
        return 'Menunggu Pembayaran';
      case 'PAYMENT_CONFIRMED':
      case 'PEMBAYARAN_DIKONFIRMASI':
        return 'Pembayaran Dikonfirmasi';
      case 'UNIT_PREPARATION':
      case 'MOTOR_DISIAPKAN':
        return 'Motor Disiapkan';
      case 'READY_FOR_DELIVERY':
      case 'SIAP_DIKIRIM':
        return 'Siap Dikirim';
      case 'DELIVERED':
      case 'DALAM_PENGIRIMAN':
        return 'Dalam Pengiriman';
      case 'APPROVED':
      case 'DISETUJUI':
      case 'KREDIT_DISETUJUI':
        return 'Disetujui';
      case 'COMPLETED':
      case 'SELESAI':
        return 'Selesai';
      case 'REJECTED':
      case 'DITOLAK':
      case 'KREDIT_DITOLAK':
        return 'Ditolak';
      case 'CANCELLED':
      case 'DIBATALKAN':
        return 'Dibatalkan';
      case 'DATA_TIDAK_VALID':
      case 'PERBAIKI_DOKUMEN':
        return 'Perbaiki Dokumen';
      case 'DITARIK_LEASING':
        return 'Ditarik Leasing';
      default:
        // Format snake_case to Title Case: "SOME_CODE" -> "Some Code"
        return clean
            .toLowerCase()
            .split('_')
            .map((word) => word.isNotEmpty ? '${word[0].toUpperCase()}${word.substring(1)}' : '')
            .join(' ');
    }
  }
}
