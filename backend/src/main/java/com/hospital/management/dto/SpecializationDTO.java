package com.hospital.management.dto;

public class SpecializationDTO {

    private Long id;
    private String name;
    private String description;
    private String iconName;

    public SpecializationDTO() {}

    public SpecializationDTO(Long id, String name, String description, String iconName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconName = iconName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
}
