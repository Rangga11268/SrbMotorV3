import 'package:intl/intl.dart';
import 'motor.dart';

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

  bool get isSurveyOverdue => _isSurveyOverdue ?? false;
  bool get isSurveyConfirmed => _isSurveyConfirmed ?? false;
  bool get isCredit => transactionType.toUpperCase() == 'CREDIT';
  String get motorName => motor?.name ?? 'Unit Motor';
  String get referenceNumber => orderNumber;
  String get createdAtFormatted => formattedDate;

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
