import { mailer } from './config/mailer.js';
import { AdaptController } from './controllers/AdaptController.js';
import { AssessmentController } from './controllers/AssessmentController.js';
import { AuthController } from './controllers/AuthController.js';
import { DiagnosticController } from './controllers/DiagnosticController.js';
import { ProfileController } from './controllers/ProfileController.js';
import { TrailController } from './controllers/TrailController.js';
import { TutorController } from './controllers/TutorController.js';
import { AssessmentRepository } from './repositories/AssessmentRepository.js';
import { DiagnosticRepository } from './repositories/DiagnosticRepository.js';
import { MaterialRepository } from './repositories/MaterialRepository.js';
import { ModuleRepository } from './repositories/ModuleRepository.js';
import { ProgressRepository } from './repositories/ProgressRepository.js';
import { SpecialistRequestRepository } from './repositories/SpecialistRequestRepository.js';
import { TrailAdaptationRepository } from './repositories/TrailAdaptationRepository.js';
import { TrailRepository } from './repositories/TrailRepository.js';
import { UserRepository } from './repositories/UserRepository.js';
import { AdaptTrailService } from './services/AdaptTrailService.js';
import { AssessmentService } from './services/AssessmentService.js';
import { AuthService } from './services/AuthService.js';
import { DiagnosticService } from './services/DiagnosticService.js';
import { ProfileService } from './services/ProfileService.js';
import { LocalDiskStorageService } from './services/StorageService.js';
import { SpecialistService } from './services/SpecialistService.js';
import { TrailService } from './services/TrailService.js';
import { TutorService } from './services/TutorService.js';

export interface Container {
  controllers: {
    auth: AuthController;
    diagnostic: DiagnosticController;
    trail: TrailController;
    tutor: TutorController;
    assessment: AssessmentController;
    adapt: AdaptController;
    profile: ProfileController;
  };
}

export function buildContainer(): Container {
  const userRepo = new UserRepository();
  const moduleRepo = new ModuleRepository();
  const trailRepo = new TrailRepository();
  const progressRepo = new ProgressRepository();
  const assessmentRepo = new AssessmentRepository();
  const materialRepo = new MaterialRepository();
  const diagnosticRepo = new DiagnosticRepository();
  const adaptationRepo = new TrailAdaptationRepository();
  const specialistRepo = new SpecialistRequestRepository();

  const storageService = new LocalDiskStorageService();

  const authService = new AuthService(userRepo);
  const diagnosticService = new DiagnosticService(
    userRepo,
    diagnosticRepo,
    trailRepo,
    moduleRepo,
    progressRepo,
  );
  const trailService = new TrailService(userRepo, trailRepo, moduleRepo, progressRepo);
  const tutorService = new TutorService(
    userRepo,
    trailRepo,
    moduleRepo,
    progressRepo,
    materialRepo,
  );
  const assessmentService = new AssessmentService(
    userRepo,
    trailRepo,
    moduleRepo,
    progressRepo,
    assessmentRepo,
  );
  const adaptTrailService = new AdaptTrailService(
    userRepo,
    trailRepo,
    moduleRepo,
    progressRepo,
    adaptationRepo,
  );
  const specialistService = new SpecialistService(userRepo, specialistRepo, mailer);
  const profileService = new ProfileService(userRepo, storageService);

  return {
    controllers: {
      auth: new AuthController(authService),
      diagnostic: new DiagnosticController(diagnosticService),
      trail: new TrailController(trailService),
      tutor: new TutorController(tutorService),
      assessment: new AssessmentController(assessmentService),
      adapt: new AdaptController(adaptTrailService, specialistService),
      profile: new ProfileController(profileService),
    },
  };
}
