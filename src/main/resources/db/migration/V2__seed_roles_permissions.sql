INSERT INTO role (role_id, role_name, created_user, created_date_time, version)
VALUES (1, 'ADMIN', 'system', NOW(), 1),
       (2, 'MANAGER', 'system', NOW(), 1),
       (3, 'USER', 'system', NOW(), 1);

INSERT INTO permission (permission_id, permission_name)
VALUES (1, 'READ_INVENTORY'),
       (2, 'WRITE_INVENTORY'),
       (3, 'MANAGE_USERS'),
       (4, 'MANAGE_ROLES');

INSERT INTO role_permission (ref_id, role_id, permission_id)
VALUES (1, 1, 1), (2, 1, 2), (3, 1, 3), (4, 1, 4),
       (5, 2, 1), (6, 2, 2),
       (7, 3, 1);
