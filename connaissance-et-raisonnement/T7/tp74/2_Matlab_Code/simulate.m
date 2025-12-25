function vitesse = simulate(fis, distance, visibilite)

vitesse = evalfis(fis,[distance visibilite]);
fprintf('Distance = %d m | Visibilite = %d %% | Vitesse = %.2f km/h\n', ...
        distance, visibilite, vitesse);
end
