package com.gym.trainer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for trainer registering a schedule
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerScheduleRegistrationDTO {
    private Integer lichHocId;
    private Integer hlvId;
    private String hlvName;
    private String email;
}
