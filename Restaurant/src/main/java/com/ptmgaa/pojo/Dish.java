/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.pojo;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.io.Serializable;
import java.util.Set;
import org.springframework.web.multipart.MultipartFile;
/**
 *
 * @author Miee
 */
@Entity
@Table(name = "dish")
@NamedQueries({
    @NamedQuery(name = "Dish.findAll", query = "SELECT d FROM Dish d"),
    @NamedQuery(name = "Dish.findById", query = "SELECT d FROM Dish d WHERE d.id = :id")})
public class Dish implements Serializable {



    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
    @Column(name = "image_url")
    private String imageUrl;
    @Basic(optional = false)
    @Column(name = "price")
    private Double price;
    @Column(name = "prep_time")
    private Integer prepTime;
    @Column(name = "active")
    private Boolean active = true;
   
    @Transient
    private MultipartFile file;
    
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Category categoryId;

    @JoinColumn(name = "chef_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private User chefId;

    @JoinTable(name = "dish_ingredient", joinColumns = {
        @JoinColumn(name = "dish_id", referencedColumnName = "id")}, inverseJoinColumns = {
        @JoinColumn(name = "ingredient_id", referencedColumnName = "id")})
    @ManyToMany
    @JsonIgnore
    private Set<Ingredient> ingredientSet;

    @ManyToMany(mappedBy = "dishSet")
    @JsonIgnore
    private Set<Menu> menuSet;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "dishId")
    @JsonIgnore
    private Set<OrderDetail> orderDetailSet;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "dishId")
    @JsonIgnore
    private Set<Review> reviewSet;

    public Dish() {
    }

    public Dish(Integer id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (getId() != null ? getId().hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof Dish)) {
            return false;
        }
        Dish other = (Dish) object;
        return !((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id)));
    }

    @Override
    public String toString() {
        return "com.ptmgaa.pojo.Dish[ id=" + getId() + " ]";
    }

    /**
     * @return the serialVersionUID
     */
    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    /**
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the imageUrl
     */
    public String getImageUrl() {
        return imageUrl;
    }

    /**
     * @param imageUrl the imageUrl to set
     */
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    /**
     * @return the price
     */
    public Double getPrice() {
        return price;
    }

    /**
     * @param price the price to set
     */
    public void setPrice(Double price) {
        this.price = price;
    }

    /**
     * @return the prepTime
     */
    public Integer getPrepTime() {
        return prepTime;
    }

    /**
     * @param prepTime the prepTime to set
     */
    public void setPrepTime(Integer prepTime) {
        this.prepTime = prepTime;
    }

    /**
     * @return the categoryId
     */
    public Category getCategoryId() {
        return categoryId;
    }

    /**
     * @param categoryId the categoryId to set
     */
    public void setCategoryId(Category categoryId) {
        this.categoryId = categoryId;
    }

    /**
     * @return the chefId
     */
    public User getChefId() {
        return chefId;
    }

    /**
     * @param chefId the chefId to set
     */
    public void setChefId(User chefId) {
        this.chefId = chefId;
    }

    /**
     * @return the ingredientSet
     */
    public Set<Ingredient> getIngredientSet() {
        return ingredientSet;
    }

    /**
     * @param ingredientSet the ingredientSet to set
     */
    public void setIngredientSet(Set<Ingredient> ingredientSet) {
        this.ingredientSet = ingredientSet;
    }

    /**
     * @return the menuSet
     */
    public Set<Menu> getMenuSet() {
        return menuSet;
    }

    /**
     * @param menuSet the menuSet to set
     */
    public void setMenuSet(Set<Menu> menuSet) {
        this.menuSet = menuSet;
    }

    /**
     * @return the orderDetailSet
     */
    public Set<OrderDetail> getOrderDetailSet() {
        return orderDetailSet;
    }

    /**
     * @param orderDetailSet the orderDetailSet to set
     */
    public void setOrderDetailSet(Set<OrderDetail> orderDetailSet) {
        this.orderDetailSet = orderDetailSet;
    }

    /**
     * @return the reviewSet
     */
    public Set<Review> getReviewSet() {
        return reviewSet;
    }

    /**
     * @param reviewSet the reviewSet to set
     */
    public void setReviewSet(Set<Review> reviewSet) {
        this.reviewSet = reviewSet;
    }

    /**
     * @return the active
     */
    public Boolean getActive() {
        return active;
    }

    /**
     * @param active the active to set
     */
    public void setActive(Boolean active) {
        this.active = active;
    }
    
        /**
     * @return the file
     */
    public MultipartFile getFile() {
        return file;
    }

    /**
     * @param file the file to set
     */
    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
