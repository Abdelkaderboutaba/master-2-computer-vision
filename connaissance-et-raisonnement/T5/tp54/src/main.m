%% TP Dempster-Shafer - Vision Autonome
clc; clear;

%% 1. Cadre de discernement
Omega = {'Pieton','Vehicule','Debris'};

%% 2. Définition des masses des experts

% Expert 1 : Caméra YOLO
m1.subsets = {{'Pieton'}, {'Vehicule'}, {'Pieton','Vehicule','Debris'}};
m1.masses  = [0.7, 0.2, 0.1];

% Expert 2 : LiDAR
m2.subsets = {{'Pieton','Debris'}, {'Vehicule'}, {'Pieton','Vehicule','Debris'}};
m2.masses  = [0.6, 0.1, 0.3];

% Expert 3 : Radar (affaiblissement)
alpha = 0.85; % fiabilité
m3.subsets = {{'Pieton','Vehicule','Debris'}};
m3.masses = [alpha];

%% 3. Combinaison des masses
m12 = dsCombine(m1, m2, Omega);
m123 = dsCombine(m12, m3, Omega);

%% 4. Calcul Belief et Plausibility
fprintf('=== Résultats Dempster-Shafer ===\n');
for i = 1:length(Omega)
    H = {Omega{i}};
    bel = dsBelief(m123, H, Omega);
    pl  = dsPlausibility(m123, H, Omega);
    fprintf('%s -> Belief: %.4f, Plausibility: %.4f\n', Omega{i}, bel, pl);
end

%% 5. Décision finale via pignistic probability
pignistic_probs = dsPignistic(m123, Omega);
[~, idx] = max(pignistic_probs);
decision = Omega{idx};
fprintf('\nDecision finale: %s (probabilité=%.4f)\n', decision, pignistic_probs(idx));

%% 6. Sauvegarder les résultats
results_folder = 'C:\Users\AYOO INFORMATIQUE\Desktop\tp54\results';
if ~exist(results_folder, 'dir')
    mkdir(results_folder);
end
save(fullfile(results_folder,'results_scenario1.mat'),'m123','pignistic_probs','decision');

%% 7. Fonctions auxiliaires

function m_combined = dsCombine(m1, m2, Omega)
% Combinaison de Dempster-Shafer
m_combined = struct();
m_combined.subsets = {};
m_combined.masses = [];
K = 0;
temp_masses = containers.Map('KeyType','char','ValueType','double');

for i = 1:length(m1.masses)
    for j = 1:length(m2.masses)
        A = m1.subsets{i};
        B = m2.subsets{j};
        intersection = intersect(A,B);
        mass_product = m1.masses(i) * m2.masses(j);
        if isempty(intersection)
            K = K + mass_product;
        else
            key = strjoin(sort(intersection), ',');
            if isKey(temp_masses, key)
                temp_masses(key) = temp_masses(key) + mass_product;
            else
                temp_masses(key) = mass_product;
            end
        end
    end
end

if K >= 1
    error('Conflit total : K >= 1');
end

keys_list = keys(temp_masses);
for i = 1:length(keys_list)
    key = keys_list{i};
    subset = strsplit(key, ',');
    m_combined.subsets{end+1} = subset;
    m_combined.masses(end+1) = temp_masses(key) / (1 - K);
end
end

function bel = dsBelief(m, H, Omega)
bel = 0;
for i = 1:length(m.masses)
    A = m.subsets{i};
    if all(ismember(A, H))
        bel = bel + m.masses(i);
    end
end
end

function pl = dsPlausibility(m, H, Omega)
pl = 0;
for i = 1:length(m.masses)
    A = m.subsets{i};
    if ~isempty(intersect(A, H))
        pl = pl + m.masses(i);
    end
end
end

function probs = dsPignistic(m, Omega)
probs = zeros(1, length(Omega));
for i = 1:length(m.masses)
    A = m.subsets{i};
    card_A = length(A);
    for j = 1:length(Omega)
        if ismember(Omega{j}, A)
            probs(j) = probs(j) + m.masses(i) / card_A;
        end
    end
end
end
