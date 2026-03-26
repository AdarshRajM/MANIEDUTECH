package com.example.Student.Course.Management.System.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class WebSocketController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public Map<String, String> sendMessage(@Payload Map<String, String> chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.raiseHand")
    @SendTo("/topic/public")
    public Map<String, String> raiseHand(@Payload Map<String, String> actionMessage) {
        return actionMessage;
    }
}
