package com.test.repository;

import com.test.models.ProjectDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectSearchRepository extends ElasticsearchRepository<ProjectDocument, String> {
    List<ProjectDocument> findByUserIdAndNameContainingOrUserIdAndDescriptionContaining( String userId, String name, String userId2, String description);
    List<ProjectDocument> findByUserId(String userId);
}