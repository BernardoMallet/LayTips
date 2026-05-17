import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { AnalysisController } from "./analysis.controller";
import { AnalysisService } from "./analysis.service";
import { ApiFootballService } from "./api-football.service";

@Module({
  imports: [HttpModule],
  controllers: [AnalysisController],
  providers: [AnalysisService, ApiFootballService],
})
export class AppModule {}
