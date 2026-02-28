import { PrismaClient, Payment, PaymentStatus } from '@prisma/client';

export class PaymentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Payment> { return this.prisma.payment.create({ data }); }

  async findById(id: string) { return this.prisma.payment.findUnique({ where: { id }, include: { invoice: true } }); }

  async findByProviderPaymentId(providerPaymentId: string) { return this.prisma.payment.findFirst({ where: { providerPaymentId } }); }

  async findByProviderOrderId(providerOrderId: string) { return this.prisma.payment.findFirst({ where: { providerOrderId } }); }

  async update(id: string, data: any) { return this.prisma.payment.update({ where: { id }, data, include: { invoice: true } }); }

  async findByCompany(companyId: string, params: { page: number; limit: number }) {
    const { page, limit } = params;
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({ where: { companyId }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { invoice: true } }),
      this.prisma.payment.count({ where: { companyId } }),
    ]);
    return { data, total };
  }

  async findAll(params: { page: number; limit: number; status?: PaymentStatus }) {
    const { page, limit, status } = params;
    const where: any = {};
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { invoice: true } }),
      this.prisma.payment.count({ where }),
    ]);
    return { data, total };
  }

  async createInvoice(data: any) { return this.prisma.invoice.create({ data }); }

  async getInvoice(paymentId: string) { return this.prisma.invoice.findUnique({ where: { paymentId } }); }

  async getInvoicesByCompany(companyId: string) { return this.prisma.invoice.findMany({ where: { companyId }, orderBy: { issuedAt: 'desc' } }); }
}
