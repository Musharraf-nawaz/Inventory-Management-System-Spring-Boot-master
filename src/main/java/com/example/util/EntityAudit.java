package com.example.util;

import java.math.BigDecimal;
import java.util.Date;
import java.util.function.Consumer;

public final class EntityAudit {

    private EntityAudit() {
    }

    public static void stampCreate(
            Consumer<String> createdUser,
            Consumer<Date> createdDateTime,
            Consumer<BigDecimal> version,
            String actor,
            Date now) {
        createdUser.accept(AuditHelper.actor(actor));
        createdDateTime.accept(now);
        version.accept(AuditHelper.initialVersion());
    }

    public static void stampUpdate(Consumer<String> lastModifiedUser, Consumer<Date> lastModifiedDateTime,
                                   String actor, Date now) {
        lastModifiedUser.accept(AuditHelper.actor(actor));
        lastModifiedDateTime.accept(now);
    }
}
