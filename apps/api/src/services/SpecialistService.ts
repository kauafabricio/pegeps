import type { Mailer } from '../config/mailer.js';
import { SpecialistRequestStatus } from '../domain/index.js';
import { NotFoundError } from '../errors/AppError.js';
import type { SpecialistRequestRepository } from '../repositories/SpecialistRequestRepository.js';
import type { UserRepository } from '../repositories/UserRepository.js';

export interface SpecialistRequestOutput {
  requestId: string;
  email: string;
  status: SpecialistRequestStatus;
  message: string;
}

export class SpecialistService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly specialistRepo: SpecialistRequestRepository,
    private readonly mailer: Mailer,
  ) {}

  async requestConsultation(userId: string): Promise<SpecialistRequestOutput> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const request = await this.specialistRepo.create(userId);
    const firstName = user.name.split(/\s+/)[0] || user.name;

    await this.mailer.sendMail({
      to: user.email,
      subject: 'Solicitação de consultoria recebida — Pegeps',
      text: `Olá, ${firstName}! Recebemos sua solicitação de consultoria com um especialista em gestão de projetos. Em breve você receberá instruções detalhadas por este e-mail.`,
      html: `<p>Olá, <strong>${firstName}</strong>!</p><p>Recebemos sua solicitação de consultoria com um especialista em gestão de projetos na plataforma <strong>Pegeps</strong>.</p><p>Em breve enviaremos as próximas instruções por este e-mail.</p>`,
    });

    return {
      requestId: request.id,
      email: user.email,
      status: request.status,
      message: `Solicitação registrada! Enviamos uma confirmação para ${user.email} com os próximos passos.`,
    };
  }
}
