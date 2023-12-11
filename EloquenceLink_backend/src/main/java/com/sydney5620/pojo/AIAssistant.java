package com.sydney5620.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIAssistant {
    private Long aiId;
    private Long userId;
    private String aiName;
    private String command;
    private Double creativity;
    private Integer contextCount;
    private Integer replyLength;
    private String content;
}
