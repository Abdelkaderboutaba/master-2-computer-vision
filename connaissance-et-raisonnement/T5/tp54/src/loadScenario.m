function [Omega, m1, m2, m3, alpha] = loadScenario(filename)
% Charge un scénario depuis un fichier .mat
s = load(filename);

Omega = s.Omega;
m1    = s.m1;
m2    = s.m2;
m3    = s.m3;
if isfield(s,'alpha')
    alpha = s.alpha;
else
    alpha = 1;
end
end
