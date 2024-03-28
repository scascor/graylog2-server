/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
package org.graylog2.indexer.datanode;

import jakarta.validation.constraints.NotNull;
import org.graylog2.indexer.migration.IndexerConnectionCheckResult;
import org.graylog2.indexer.migration.RemoteReindexMigration;

import java.net.URI;

public interface RemoteReindexingMigrationAdapter {
    enum Status {
        NOT_STARTED, STARTING, RUNNING, ERROR, FINISHED
    }

    RemoteReindexMigration start(RemoteReindexRequest request);

    RemoteReindexMigration status(@NotNull String migrationID);

    IndexerConnectionCheckResult checkConnection(final URI uri, final String username, final String password);
}
