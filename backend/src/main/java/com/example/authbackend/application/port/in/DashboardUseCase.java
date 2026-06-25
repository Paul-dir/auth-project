package com.example.authbackend.application.port.in;

import com.example.authbackend.application.dto.DashboardStatsDto;

public interface DashboardUseCase {
    DashboardStatsDto getStats();
}
