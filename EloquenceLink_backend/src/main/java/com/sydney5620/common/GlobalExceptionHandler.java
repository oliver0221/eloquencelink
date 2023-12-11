package com.sydney5620.common;

import com.sydney5620.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;


@ControllerAdvice(annotations = { Controller.class})
@ResponseBody
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public Result<String> BusinessExceptionHandler(BusinessException ex){
        log.error(ex.getMessage());
        return Result.error(ex.getMessage());
    }


    @ExceptionHandler(Exception.class)
    public Result<String> handleUnknownException(Exception e) {
        return Result.error("Unknown error");
    }


}
