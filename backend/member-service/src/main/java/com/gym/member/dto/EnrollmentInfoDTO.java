package com.gym.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentInfoDTO {
    private Integer enrollmentId;
    private Integer memberId;
    private Integer classId;
    private String packageName;
    private Integer totalSessions;
    private Integer sessionsUsed;
    private Integer sessionsRemaining;
    private String status;
    private boolean canEnrollMore;
}
