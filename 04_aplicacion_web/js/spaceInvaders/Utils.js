const aabbDetection = (entity1, entity2) => {
    return (entity1.x < entity2.x + entity2.w && entity1.x + entity1.w > entity2.x &&
        entity1.y < entity2.y + entity2.h && entity1.h + entity1.y > entity2.y)
}