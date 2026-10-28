import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ServiceAppointment {
  final int id;
  final String branch;
  final String customerName;
  final String customerPhone;
  final String plateNumber;
  final String queueNumber;
  final String motorModel;
  final String serviceDate;
  final String serviceTime;
  final String serviceType;
  final String? complaintNotes;
  final String status;
  final DateTime? createdAt;
  final String? customBookingCode;

  ServiceAppointment({
    required this.id,
    required this.branch,
    required this.customerName,
    required this.customerPhone,
    required this.plateNumber,
    required this.queueNumber,
    required this.motorModel,
    required this.serviceDate,
    required this.serviceTime,
    required this.serviceType,
    this.complaintNotes,
    required this.status,
    this.createdAt,
    this.customBookingCode,
  });

  String get bookingCode => customBookingCode ?? 'SRB-SRV-${id.toString().padLeft(4, '0')}';
  String get motorName => motorModel;
  String get appointmentDate => serviceDate;
  String get formattedTime => serviceTime.length >= 5 ? serviceTime.substring(0, 5) : serviceTime;

  factory ServiceAppointment.fromJson(Map<String, dynamic> json) {
    DateTime? parsedCreatedAt;
    if (json['created_at'] != null) {
      try {
        parsedCreatedAt = DateTime.parse(json['created_at'].toString());
      } catch (_) {}
    }

    final rawMotor = json['motor_model'] ?? json['motor_name'];
    final rawDate = json['service_date'] ?? json['appointment_date'];
    final rawTime = json['service_time'] ?? json['appointment_time'];

    return ServiceAppointment(
      id: json['id'] is int ? json['id'] as int : int.tryParse(json['id'].toString()) ?? 0,
      branch: json['branch']?.toString() ?? json['branch_name']?.toString() ?? 'SRB Motor Pusat',
      customerName: json['customer_name']?.toString() ?? '-',
      customerPhone: json['customer_phone']?.toString() ?? '-',
      plateNumber: (json['plate_number']?.toString() ?? '').toUpperCase(),
      queueNumber: json['queue_number']?.toString() ?? 'A-01',
      motorModel: rawMotor?.toString() ?? 'Unit Motor',
      serviceDate: rawDate?.toString() ?? '',
      serviceTime: rawTime?.toString() ?? '09:00',
      serviceType: json['service_type']?.toString() ?? 'Servis Berkala',
      complaintNotes: (json['complaint_notes'] ?? json['complaints'])?.toString(),
      status: (json['status']?.toString() ?? 'pending').toLowerCase(),
      createdAt: parsedCreatedAt,
      customBookingCode: json['booking_code']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'branch': branch,
      'customer_name': customerName,
      'customer_phone': customerPhone,
      'plate_number': plateNumber,
      'queue_number': queueNumber,
      'motor_model': motorModel,
      'service_date': serviceDate,
      'service_time': serviceTime,
      'service_type': serviceType,
      'complaint_notes': complaintNotes,
      'status': status,
      'created_at': createdAt?.toIso8601String(),
    };
  }

  // Status Helpers
  bool get isPending => status == 'pending';
  bool get isConfirmed => status == 'confirmed';
  bool get isInProgress => status == 'in_progress';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';

  String get statusLabel {
    switch (status) {
      case 'confirmed':
        return 'Terkonfirmasi';
      case 'in_progress':
        return 'Sedang Dikerjakan';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      case 'pending':
      default:
        return 'Menunggu Konfirmasi';
    }
  }

  Color get statusColor {
    switch (status) {
      case 'confirmed':
        return const Color(0xFF1D4ED8); // Royal Blue
      case 'in_progress':
        return const Color(0xFFD97706); // Amber
      case 'completed':
        return const Color(0xFF16A34A); // Emerald
      case 'cancelled':
        return const Color(0xFFDC2626); // Red
      case 'pending':
      default:
        return const Color(0xFF64748B); // Slate
    }
  }

  Color get statusBgColor {
    switch (status) {
      case 'confirmed':
        return const Color(0xFFEFF6FF);
      case 'in_progress':
        return const Color(0xFFFEF3C7);
      case 'completed':
        return const Color(0xFFDCFCE7);
      case 'cancelled':
        return const Color(0xFFFEE2E2);
      case 'pending':
      default:
        return const Color(0xFFF1F5F9);
    }
  }

  String get formattedDate {
    if (serviceDate.isEmpty) return '-';
    try {
      final dt = DateTime.parse(serviceDate);
      return DateFormat('EEEE, d MMMM yyyy', 'id_ID').format(dt);
    } catch (_) {
      return serviceDate;
    }
  }
}
