package com.gym.trainer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for approving or rejecting a schedule
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalActionDTO {
    private Integer lichHocId;
    private String action; // "approve" or "reject"
    private String lyDoTuChoi; // Reason for rejection (optional)
}
