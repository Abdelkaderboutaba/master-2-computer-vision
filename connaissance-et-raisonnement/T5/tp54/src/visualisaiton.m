function visualization(m,Omega,decision,pignistic_probs)
Bel = zeros(1,length(Omega));
Pl  = zeros(1,length(Omega));
for i=1:length(Omega)
    Bel(i) = dsBelief(m,{Omega{i}},Omega);
    Pl(i)  = dsPlausibility(m,{Omega{i}},Omega);
end

figure;
bar([Bel; Pl]');
xticks(1:length(Omega));
xticklabels(Omega);
legend('Belief','Plausibility');
title(['Decision finale: ', decision]);
grid on;

figure;
bar(pignistic_probs);
xticks(1:length(Omega));
xticklabels(Omega);
title('Probabilité Pignistique');
grid on;
end
