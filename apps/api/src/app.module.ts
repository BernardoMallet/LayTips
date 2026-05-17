import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AnalysisController } from "./analysis.controller";
import { AnalysisService } from "./analysis.service";
import { FootyStatsService } from "@laytips/footystats";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AnalysisController],
  providers: [
    AnalysisService,
    {
      provide: FootyStatsService,
      useFactory: () => {
        const apiKey = process.env.FOOTYSTATS_API_KEY;
        if (!apiKey) {
          throw new Error(
            "FOOTYSTATS_API_KEY não configurada"
          );
        }
        return new FootyStatsService(apiKey);
      },
    },
  ],
})
export class AppModule {}
