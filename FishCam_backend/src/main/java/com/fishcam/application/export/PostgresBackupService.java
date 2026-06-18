package com.fishcam.application.export;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;

@Slf4j
@Service
public class PostgresBackupService {

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    public File generateSqlBackup() throws Exception {
        // Exemple dbUrl : jdbc:postgresql://fishcam-db:5432/fishcam_db
        
        // 1. Extraire le nom de la base de données (ce qu'il y a après le dernier /)
        String dbName = dbUrl.substring(dbUrl.lastIndexOf("/") + 1);
        
        // 2. Extraire l'hôte (host)
        // On enlève "jdbc:postgresql://"
        String cleanUrl = dbUrl.replace("jdbc:postgresql://", "");
        // On prend ce qu'il y a avant les deux-points du port (ex: fishcam-db)
        String dbHost = cleanUrl.substring(0, cleanUrl.indexOf(":"));

        // Créer le dossier s'il n'existe pas
        File backupDir = new File("backups");
        if (!backupDir.exists()) {
            backupDir.mkdir();
        }

        // Nom du fichier : fishcam_backup_2026-06-15.sql
        String filename = "backups/fishcam_backup_" + LocalDate.now() + ".sql";

        // NOUVEAU : On ajoute "-h" et dbHost
        ProcessBuilder pb = new ProcessBuilder(
                "pg_dump",
                "-h", dbHost,
                "-U", dbUsername,
                "-f", filename,
                dbName
        );

        pb.environment().put("PGPASSWORD", dbPassword);
        Process process = pb.start();
        int exitCode = process.waitFor();

        if (exitCode == 0) {
            log.info("💾 Sauvegarde locale réussie : {}", filename);
            cleanOldLocalBackups(backupDir);
            return new File(filename);
        } else {
            throw new RuntimeException("Échec de pg_dump. Code: " + exitCode);
        }
    }

    private void cleanOldLocalBackups(File backupDir) {
        File[] files = backupDir.listFiles((dir, name) -> name.endsWith(".sql") || name.endsWith(".csv"));
        if (files != null) {
            long sevenDaysAgo = System.currentTimeMillis() - (7L * 24 * 60 * 60 * 1000);
            for (File file : files) {
                if (file.lastModified() < sevenDaysAgo) {
                    if (file.delete()) {
                        log.info("🗑️ Ancien backup local supprimé : {}", file.getName());
                    }
                }
            }
        }
    }
}