package com.alpha49;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration for MVC resources.
 */
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    /**
     * Adds resource handlers for serving static resources.
     *
     * @param registry the resource handler registry
     */
    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/styles/**")
                .addResourceLocations("classpath:/public/styles/");
    }
}
