package com.example.util;

import java.math.BigDecimal;
import java.util.Date;

public final class AuditHelper {

    private AuditHelper() {
    }

    public static void stampCreate(String actor, Date now, Runnable setCreatedUser, Runnable setCreatedDateTime,
                                   Runnable setVersion) {
        setCreatedUser.run();
        setCreatedDateTime.run();
        if (setVersion != null) {
            setVersion.run();
        }
    }

    public static Date now() {
        return new Date();
    }

    public static BigDecimal initialVersion() {
        return BigDecimal.ONE;
    }

    public static String actor(String provided) {
        return provided != null && !provided.isBlank() ? provided : "system";
    }
}
