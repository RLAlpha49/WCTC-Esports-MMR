package com.alpha49;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller for handling routes.
 */
@Controller
public final class AppController {

    /**
     * Handles the "/" route.
     *
     * @return the name of the home view
     */
    @GetMapping("/")
    public String home() {
        return "index";
    }

    /**
     * Handles the "/rocket-league" route.
     *
     * @return the name of the about view
     */
    @GetMapping("/rocket-league")
    public String about() {
        return "rocket-league";
    }
}
