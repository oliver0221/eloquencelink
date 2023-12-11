package com.sydney5620.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    // 定义静态常量状态码
    public static final int SUCCESS = 200;
    public static final int ERROR = 400;

    private Integer code;
    private String msg;
    private T data;

    public static <T> Result<T> success() {
        Result<T> r = new Result<>();
        r.code = SUCCESS;
        return r;
    }

    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.code = SUCCESS;
        r.data = data;
        return r;
    }

    public static <T> Result<T> success(T data, String msg) {
        Result<T> r = new Result<>();
        r.code = SUCCESS;
        r.data = data;
        r.msg = msg;
        return r;
    }

    public static Result error(String msg) {
        Result r = new Result();
        r.code = ERROR;
        r.msg = msg;
        return r;
    }
}
