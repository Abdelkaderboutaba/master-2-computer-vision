function m_combined = dsCombine(m1, m2, Omega)
% Combinaison Dempster-Shafer
m_combined = struct();
m_combined.subsets = {};
m_combined.masses = [];
K = 0;
temp_masses = containers.Map('KeyType','char','ValueType','double');

for i=1:length(m1.masses)
    for j=1:length(m2.masses)
        A = m1.subsets{i};
        B = m2.subsets{j};
        intersection = intersect(A,B);
        mass_product = m1.masses(i)*m2.masses(j);
        if isempty(intersection)
            K = K + mass_product;
        else
            key = strjoin(sort(intersection), ',');
            if isKey(temp_masses,key)
                temp_masses(key) = temp_masses(key) + mass_product;
            else
                temp_masses(key) = mass_product;
            end
        end
    end
end

if K>=1
    error('Conflit total K>=1');
end

keys_list = keys(temp_masses);
for i=1:length(keys_list)
    key = keys_list{i};
    subset = strsplit(key,',');
    m_combined.subsets{end+1} = subset;
    m_combined.masses(end+1) = temp_masses(key)/(1-K);
end
end

function bel = dsBelief(m,H,Omega)
bel = 0;
for i=1:length(m.masses)
    A = m.subsets{i};
    if all(ismember(A,H))
        bel = bel + m.masses(i);
    end
end
end

function pl = dsPlausibility(m,H,Omega)
pl = 0;
for i=1:length(m.masses)
    A = m.subsets{i};
    if ~isempty(intersect(A,H))
        pl = pl + m.masses(i);
    end
end
end

function probs = dsPignistic(m,Omega)
probs = zeros(1,length(Omega));
for i=1:length(m.masses)
    A = m.subsets{i};
    card_A = length(A);
    for j=1:length(Omega)
        if ismember(Omega{j},A)
            probs(j) = probs(j) + m.masses(i)/card_A;
        end
    end
end
end
