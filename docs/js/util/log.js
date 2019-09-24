var console_log_i = 0;

function console_log(str) {
    console.log(console_log_i + ": " +  str);
    console_log_i += 1;
}

function console_warn(str) {
    console.warn(console_log_i + ": " +  str);
    console_log_i += 1;
}